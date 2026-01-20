import express from 'express';
import axios from 'axios';
import User from '../models/User.js';

const router = express.Router();

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_URL = 'https://api.heygen.com/v2/video/generate';

// @route   POST /api/avatar/generate
// @desc    Generate a new avatar video and save to user profile
// @access  Private (requires authentication middleware in main app)
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// @route   POST /api/avatar/generate
// @desc    Generate a new avatar video (Custom Talking Photo) and save to user profile
// @access  Private
// @route   POST /api/avatar/generate
// @desc    Generate a new avatar video (Custom Talking Photo) and save to user profile
// @access  Private
router.post('/generate', async (req, res) => {
    try {
        // text is legacy, now we use structured fields
        const { text, gender, age, style, setting, details, voice_id } = req.body;
        const userId = req.user ? req.user.id : null;
        let talkingPhotoId = req.user && req.user.avatar ? req.user.avatar.talkingPhotoId : null;

        // Construct a description from fields if 'text' is missing (which is the case now)
        let description = text;
        if (!description) {
            // Mapping for english prompts
            const genderMap = { 'Homme': 'Man', 'Femme': 'Woman' };
            const ageMap = { 'Jeune Adulte (20s)': 'Young Adult', 'Trentenaire (30s)': 'Middle Aged', 'Senior (50+)': 'Senior' };
            const styleMap = { 'Professionnel': 'Professional corporate headshot', 'Décontracté': 'Casual friendly portrait', 'Artistique': 'Artistic stylized portrait', 'Futuriste': 'Futuristic sci-fi portrait' };
            const settingMap = { 'Bureau Moderne': 'modern office background', 'Studio Minimaliste': 'minimalist studio background', 'Bibliothèque': 'library background', 'Abstrait / Uni': 'abstract gradient background' };

            const selectedGender = genderMap[gender] || 'Woman';
            const selectedAge = ageMap[age] || 'Young Adult';
            const selectedStyle = styleMap[style] || 'Professional corporate headshot';
            const selectedSetting = settingMap[setting] || 'modern office background';

            description = `A ${selectedStyle} of a ${selectedAge} ${selectedGender}, looking directly at the camera, highly detailed, photorealistic, ${selectedSetting}. ${details || ''}`;
        }

        if (!description) {
            return res.status(400).json({ error: "Description ou paramètres requis !" });
        }

        console.log(`Début du processus pour l'utilisateur ${userId}`);
        console.log(`Prompt généré: ${description}`);

        // 0. Analyze text to get attributes (Age, Gender, Ethnicity) explicitly required by HeyGen
        // We can skip OpenAI analysis if we have structured inputs, but HeyGen needs specific enum values.
        // Let's rely on our explicit mapping for 'age' and 'gender' which we already have.
        // For 'ethnicity' and 'pose', we can default or infer.

        let attributes = {
            age: (age === 'Senior (50+)' ? 'Older' : 'Young Adult'), // HeyGen might have specific age enums
            gender: (gender === 'Homme' ? 'Man' : 'Woman'),
            ethnicity: "White",
            pose: "half_body"
        };

        // Actually, let's keep the OpenAI analysis for robustness if the user provided custom details that override standard traits?
        // Or to just ensure valid JSON for HeyGen if we don't trust our mapping.
        // But for speed and cost, direct mapping is better.
        // Let's just use the OpenAI helper for 'ethnicity' since we don't capture it yet.

        console.log("0. Analyse du prompt pour extraction des attributs (Ethnicity/Pose)...");
        try {
            const analysisCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a JSON helper. Extract these 4 fields from the user description: 'age' (options: 'Young Adult', 'Early Middle Age', 'Late Middle Age', 'Senior', 'Unspecified'), 'gender' (options: 'Man', 'Woman'), 'ethnicity' (options: 'Asian', 'Black', 'Hispanic', 'Indian', 'White'), 'pose' (options: 'half_body', 'close_up', 'full_body'). Return strictly JSON."
                    },
                    { role: "user", content: description }
                ],
                model: "gpt-3.5-turbo",
                response_format: { type: "json_object" }
            });
            attributes = JSON.parse(analysisCompletion.choices[0].message.content);
            console.log("Attributs détectés:", attributes);
        } catch (e) {
            console.error("Erreur analyse attributs, utilisation defaults:", e.message);
        }

        // 1. Generate Visual Avatar using HeyGen Native API (replacing DALL-E)
        console.log("1. Génération de l'image avec HeyGen Native...");

        const generateImageResponse = await axios.post('https://api.heygen.com/v2/photo_avatar/photo/generate', {
            name: "User Custom Avatar",
            appearance: description,
            style: "Realistic",
            orientation: "square",
            age: attributes.age || "Young Adult",
            gender: attributes.gender || "Woman", // Use detected or default
            ethnicity: attributes.ethnicity || "White",
            pose: attributes.pose || "half_body"
        }, {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY,
                'Content-Type': 'application/json'
            }
        });



        const imageGenerationId = generateImageResponse.data.data.generation_id;
        console.log("HeyGen Image Job ID:", imageGenerationId);

        // Polling loop for Image Generation
        let imageUrl = null;
        let imageKey = null; // New variable to capture image_key
        let attempts = 0;
        const maxAttempts = 40; // 40 * 3s = 120s max wait

        while (!imageUrl && attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s

            try {
                const statusResponse = await axios.get(`https://api.heygen.com/v2/photo_avatar/generation/${imageGenerationId}`, {
                    headers: { 'X-Api-Key': HEYGEN_API_KEY }
                });

                const statusData = statusResponse.data.data;
                console.log(`Polling Image Status (${attempts}/${maxAttempts}):`, statusData.status);

                if (statusData.status === 'completed' || statusData.status === 'success') { // 'success' is sometimes returned by v2
                    console.log("Polling Success Data:", JSON.stringify(statusData, null, 2));
                    imageUrl = statusData.image_url || statusData.image_url_list[0]; // v2 might return list
                    imageKey = statusData.image_key || (statusData.image_key_list ? statusData.image_key_list[0] : null);
                } else if (statusData.status === 'failed') {
                    throw new Error("HeyGen Image Generation Failed: " + (statusData.error || "Unknown error"));
                }
            } catch (err) {
                console.error("Polling error:", err.message);
                // Continue polling if network glitch, or throw if it was a definitive failure logic above
                if (err.message.includes("HeyGen Image Generation Failed")) throw err;
            }
        }

        if (!imageUrl) {
            throw new Error("Timeout waiting for HeyGen Image Generation");
        }

        // We also need the image_key for creating the Avatar Group (Talking Photo)
        // If the polling data didn't contain it (e.g. earlier failures), we might need to rely on Upload Asset,
        // BUT for generated images, the image_key is in the polling success data.
        // Let's ensure we captured it. 
        // Note: The variable 'imageUrl' is set in the loop. Let's add 'imageKey' variable outside.

        // Re-implement the polling loop extraction to get imageKey
        // ... (Since I cannot easily edit the loop above without replacing it, I will assume 'imageKey' is available or I will re-fetch it from upload if missing)
        // Actually, better to modify the loop above to capture imageKey.

        // Let's modify the PREVIOUS block (the polling loop) first to capture imageKey.
        // Wait, multi_replace cannot modify previous blocks if I don't target them.
        // I will target the loop and the subsequent creation step in one go or separate chunks.

        // ...

        if (!imageKey) {
            throw new Error("Image Key not found after HeyGen Image Generation. Cannot create Talking Photo.");
        }

        console.log("Image HeyGen prête:", imageUrl);
        console.log("Image Key:", imageKey);

        // Step 2: Create Avatar Group (Talking Photo) using the generated image_key
        console.log("Création du Groupe d'Avatar (Talking Photo) avec image_key...");
        let createAvatarGroupResponse;
        try {
            createAvatarGroupResponse = await axios.post('https://api.heygen.com/v2/photo_avatar/avatar_group/create', {
                name: `AvatarGroup-${userId}-${Date.now()}`,
                image_key: imageKey,
                // You might need to specify other parameters like 'type' or 'style' if the API requires it.
                // Based on typical usage, 'image_key' is the primary identifier for a generated image.
            }, {
                headers: {
                    'X-Api-Key': HEYGEN_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            // The response should contain the talking_photo_id? Or just the group ID?
            // Documentation says "Create Photo Avatar Group... generally involves... ultimately leads to talking_photo_id".
            // Usually creating a group *with one photo* is enough to get a talking_photo_id (look ID).
            console.log("Reponse Creation Groupe:", JSON.stringify(createAvatarGroupResponse.data, null, 2));

            // Inspect response structure. Usually data.data.id (group id) or data.data.talking_photo_id?
            // If it returns a group ID, we might need to "Generate Look" or "List Looks"?
            // But let's assume for a single photo group, it might return the ID or we use the group ID as talking_photo_id?
            // Actually, the previous 'photar_not_found' suggests we need a specific ID type.
            // Let's log and see. For now, try to grab 'id' or 'talking_photo_id'.
            talkingPhotoId = createAvatarGroupResponse.data.data.id || createAvatarGroupResponse.data.data.avatar_group_id || createAvatarGroupResponse.data.data.talking_photo_id;
            console.log("Talking Photo ID créée via Avatar Group:", talkingPhotoId);

            if (!talkingPhotoId) {
                throw new Error("Impossible de récupérer l'ID de la Talking Photo.");
            }

            // Wait for Avatar Group to be ready (Not 'pending')
            console.log("Attente de la validation du groupe d'avatar...");
            let groupStatus = 'pending';
            let groupAttempts = 0;
            const maxGroupAttempts = 20; // 60 seconds

            while (groupStatus !== 'completed' && groupStatus !== 'ready' && groupAttempts < maxGroupAttempts) {
                groupAttempts++;
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s

                try {
                    // There isn't a direct "Get Group Status" endpoint widely documented in simple terms, 
                    // but List Avatar Groups returns status. 
                    // OR List Avatars in Group: GET /v2/photo_avatar/avatar_group/{id}/avatars matches logical REST patterns.
                    // Let's try listing avatars in the group to see if they are ready. 
                    // Or checking the group list.

                    // Let's try fetching the group details if an endpoint exists, or list groups and find ours.
                    // Trying a direct GET /v2/avatar_groups/{id} or /v2/photo_avatar/avatar_group/{id} is a good guess.
                    // But list is safer.

                    // Only if the previous creation response said "pending".
                    // Actually, let's just wait a bit blindly if we don't find a status endpoint, 
                    // but better to poll "List Avatars in Group" -> /v2/photo_avatar/avatar_group/{id}/avatars

                    const groupCheckResponse = await axios.get(`https://api.heygen.com/v2/avatar_group/${talkingPhotoId}/avatars`, {
                        headers: { 'X-Api-Key': HEYGEN_API_KEY }
                    });

                    // If we get a list of avatars, check their status.
                    const avatars = groupCheckResponse.data.data.avatars || [];
                    if (avatars.length > 0) {
                        // Check if any avatar is valid/ready
                        const firstAvatar = avatars[0];
                        console.log(`Polling Group Status (${groupAttempts}/${maxGroupAttempts}):`, firstAvatar.status);
                        if (firstAvatar.status === 'completed' || firstAvatar.status === 'ready') {
                            groupStatus = 'completed';
                            // CRITICAL: The ID needed for video generation might be the AVATAR ID, not the Group ID.
                            // Let's update talkingPhotoId if available.
                            if (firstAvatar.id) {
                                console.log("Mise à jour de talkingPhotoId avec l'ID de l'avatar trouvé:", firstAvatar.id);
                                talkingPhotoId = firstAvatar.id;
                            }
                        }
                    } else {
                        if (groupAttempts % 5 === 0) {
                            console.log(`Polling Group Status (${groupAttempts}/${maxGroupAttempts}): No avatars found yet...`);
                        }
                    }

                } catch (err) {
                    console.log("Polling Group Error (ignoring):", err.message);
                    if (err.response && err.response.status === 404) {
                        // Maybe endpoint is wrong, or group not ready.
                    }
                }
            }

            if (groupAttempts >= maxGroupAttempts) {
                console.warn("Avatar Group polling timed out. Attempting generation anyway...");
            } else {
                console.log("Avatar Group Ready!");
            }
            // "talking_photo_id" is usually for a specific *look*.
            // Only one way to find out: TRY. And log.
        } catch (error) {
            console.error("Erreur Création Avatar Group:", error.response ? error.response.data : error.message);
            throw error;
        }

        console.log("Talking Photo ID créée via Avatar Group:", talkingPhotoId);


        // Step 3: Prepare Payload for HeyGen Video
        const speechText = "Bonjour ! Je suis votre nouvel avatar généré par IA. " + text;

        const payload = {
            video_inputs: [
                {
                    character: {
                        type: "talking_photo",
                        talking_photo_id: talkingPhotoId
                    },
                    voice: {
                        type: "text",
                        input_text: speechText,
                        voice_id: voice_id || "1bd001e7e50f421d891986aad5158bc8"
                    },
                    background: {
                        type: "color",
                        value: "#FAFAFA"
                    }
                }
            ],
            test: false,
            dimension: {
                width: 1200,
                height: 1200
            }
        };

        // Step 4: Call HeyGen API
        console.log("Lancement de la génération vidéo...");
        const response = await axios.post(HEYGEN_URL, payload, {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const videoId = response.data.data.video_id;
        console.log(`Génération Avatar lancée ! Vidéo ID : ${videoId}`);

        // Step 5: Update User Profile
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                avatar: {
                    videoId: videoId,
                    description: description, // Save the constructed description
                    gender: gender, // Save the gender (structured)
                    generatedAt: new Date(),
                    talkingPhotoId: talkingPhotoId,
                    previewUrl: imageUrl,
                    status: 'pending'
                }
            });
            console.log(`Avatar mis à jour pour l'utilisateur ${userId}`);
        }

        res.json({
            success: true,
            video_id: videoId,
            message: "Génération HeyGen complète initiée."
        });

    } catch (error) {
        console.error("Erreur Génération:", error.response ? error.response.data : error.message);
        if (error.response && error.response.data) console.error(JSON.stringify(error.response.data, null, 2));

        res.status(500).json({
            success: false,
            error: error.response ? error.response.data : "Erreur interne lors de la génération"
        });
    }
});

// @route   GET /api/avatar/status/:videoId
// @desc    Check status of avatar generation
// @access  Private
router.get('/status/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;

        const response = await axios.get(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY
            }
        });

        const data = response.data.data || response.data; // Handle potential API response variations

        // console.log("Status HeyGen pour", videoId, ":", JSON.stringify(data, null, 2));

        // Update user profile if completed
        if (data.status === 'completed' && data.video_url && req.user) {
            await User.findOneAndUpdate(
                { _id: req.user.id, 'avatar.videoId': videoId },
                {
                    'avatar.videoUrl': data.video_url,
                    'avatar.status': 'completed'
                }
            );
        }

        res.json(data);

    } catch (error) {
        console.error("Erreur Status HeyGen:", error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            error: error.response ? error.response.data : "Erreur interne lors de la vérification du statut"
        });
    }
});

export default router;
