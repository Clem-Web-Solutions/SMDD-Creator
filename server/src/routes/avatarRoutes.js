import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import OpenAI from 'openai';

const router = express.Router();

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_URL = 'https://api.heygen.com/v2/video/generate';

const VOICE_IDS = {
    MALE: "b32ea9471bb74ee688b75dde1e2ae6d7", // Henri (French Male)
    FEMALE: "80f371302eaa4404870daa41dc62423c" // Coralie (French Female)
};

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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

            // Updated setting to include chair and gestures as requested
            const selectedSetting = 'sitting comfortably on a sleek leather office chair, isolated on solid pure white background, high key lighting, commercial photography style';

            const selectedGender = genderMap[gender] || 'Woman';
            const selectedAge = ageMap[age] || 'Young Adult';
            const selectedStyle = styleMap[style] || 'Professional corporate headshot';

            description = `Wide waist-up shot of a ${selectedAge} ${selectedGender}, ${selectedStyle}, sitting comfortably on a leather chair, hands resting naturally on knees, relaxed posture, perfectly centered composition, leaving headroom, high fidelity, 8k resolution, ${selectedSetting}. ${details || ''}`;
        }

        if (!description) {
            return res.status(400).json({ error: "Description ou paramètres requis !" });
        }

        // HeyGen limit is 1000 chars. Truncate if necessary.
        if (description.length > 990) {
            console.warn("Prompt too long, truncating...");
            description = description.substring(0, 990);
        }

        console.log(`Début du processus pour l'utilisateur ${userId}`);
        console.log(`Prompt généré: ${description}`);

        // 0. Analyze text to get attributes (Age, Gender, Ethnicity) explicitly required by HeyGen
        let attributes = {
            age: (age === 'Senior (50+)' ? 'Older' : 'Young Adult'),
            gender: (gender === 'Homme' ? 'Man' : 'Woman'),
            ethnicity: "White",
            pose: "half_body"
        };

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
            const detectedAttributes = JSON.parse(analysisCompletion.choices[0].message.content);

            // Merge detected attributes but FORCE the user-selected gender
            attributes = {
                ...attributes,
                ...detectedAttributes,
                gender: (gender === 'Homme' ? 'Man' : 'Woman') // STRICT OVERRIDE
            };

            console.log("Attributs finaux (Gender Forced):", attributes);
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
            pose: "half_body" // FORCE HALF_BODY for hands visibility
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

                    // CRITICAL FIX: Prefer specific image from list to avoid 4-image grid
                    if (statusData.image_url_list && statusData.image_url_list.length > 0) {
                        // Pick the first one
                        imageUrl = statusData.image_url_list[0];
                        // Get corresponding key
                        imageKey = statusData.image_key_list ? statusData.image_key_list[0] : (statusData.image_key || null);
                    } else {
                        imageUrl = statusData.image_url;
                        imageKey = statusData.image_key;
                    }

                } else if (statusData.status === 'failed') {
                    throw new Error("HeyGen Image Generation Failed: " + (statusData.error || "Unknown error"));
                }
            } catch (err) {
                console.error("Polling error:", err.message);
                if (err.message.includes("HeyGen Image Generation Failed")) throw err;
            }
        }

        if (!imageUrl) {
            throw new Error("Timeout waiting for HeyGen Image Generation");
        }

        if (!imageKey) {
            console.warn("WARN: Image Key missing, attempting to resolve or use URL upload fallback...");
            // Not implemented fallback, throwing for now as v2 usually returns keys
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
            }, {
                headers: {
                    'X-Api-Key': HEYGEN_API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Reponse Creation Groupe:", JSON.stringify(createAvatarGroupResponse.data, null, 2));

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
                            if (firstAvatar.id) {
                                console.log("Mise à jour de talkingPhotoId avec l'ID de l'avatar trouvé:", firstAvatar.id);
                                talkingPhotoId = firstAvatar.id;
                            }
                        }
                    } else {
                        if (groupAttempts % 5 === 0) console.log(`Polling Group Status (${groupAttempts}/${maxGroupAttempts}): No avatars found yet...`);
                    }

                } catch (err) {
                    console.log("Polling Group Error (ignoring):", err.message);
                }
            }

            if (groupAttempts >= maxGroupAttempts) {
                console.warn("Avatar Group polling timed out. Attempting generation anyway...");
            } else {
                console.log("Avatar Group Ready!");
            }
        } catch (error) {
            console.error("Erreur Création Avatar Group:", error.response ? error.response.data : error.message);
            throw error;
        }

        console.log("Talking Photo ID finie:", talkingPhotoId);

        // Step 3: Prepare Payload for HeyGen Video (Intro Video)
        const speechText = text
            ? "Bonjour ! Je suis votre nouvel avatar généré par IA. " + text
            : "Bonjour ! Je suis votre nouvel avatar interactif. Je suis prêt à animer vos formations et à présenter vos contenus. N'hésitez pas à lancer une génération pour me voir en action.";

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
                        // Select voice based on gender (Coralie for Female, Henri for Male)
                        voice_id: voice_id || (attributes.gender === 'Man' ? VOICE_IDS.MALE : VOICE_IDS.FEMALE)
                    },
                    background: {
                        type: "color",
                        value: "#FFFFFF"
                    }
                }
            ],
            test: false,
            dimension: {
                width: 1200, // Square video for profile
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
                    description: description,
                    gender: gender,
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

        const data = response.data.data || response.data;

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

// @route   GET /api/avatar/list
// @desc    List available Studio Avatars from HeyGen
// @access  Private
router.get('/list', async (req, res) => {
    try {
        console.log("Fetching HeyGen Avatars...");
        const response = await axios.get('https://api.heygen.com/v2/avatars', {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY
            }
        });

        // The API returns a list of avatars. We want to filter for "Studio Avatars" (usually type 'avatar' or flagged).
        // Let's inspect the first few to be sure, but for now pass them through.
        // We'll filter on the frontend or just send the raw list.
        const avatars = response.data.data.avatars || [];

        // Simple filtering to remove obviously wrong ones if needed, but HeyGen usually returns a clean list.
        // We specifically want 'interactive' or 'studio' avatars if distinguishable.
        // For now, return all and let frontend decide/display.

        res.json({
            success: true,
            avatars: avatars
        });

    } catch (error) {
        console.error("Erreur List Avatars:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Impossible de récupérer les avatars" });
    }
});

// @route   POST /api/avatar/select
// @desc    Select an existing Studio Avatar and save to profile
// @access  Private
router.post('/select', async (req, res) => {
    try {
        const { avatarId, name, previewUrl, gender } = req.body;
        const userId = req.user ? req.user.id : null;

        if (!userId) return res.status(401).json({ error: "Non autorisé" });
        if (!avatarId) return res.status(400).json({ error: "Avatar ID requis" });

        console.log(`User ${userId} selected Studio Avatar: ${avatarId} (${name})`);

        await User.findByIdAndUpdate(userId, {
            avatar: {
                type: 'avatar', // Explicitly mark as Studio Avatar
                avatarId: avatarId, // Store the Studio ID
                talkingPhotoId: null, // Clear generated ID
                name: name,
                previewUrl: previewUrl,
                gender: gender,
                status: 'completed', // It's ready to use immediately
                generatedAt: new Date()
            }
        });

        res.json({ success: true, message: "Avatar sélectionné avec succès" });

    } catch (error) {
        console.error("Erreur Selection Avatar:", error);
        res.status(500).json({ error: "Erreur lors de la sauvegarde de l'avatar" });
    }
});

export default router;
