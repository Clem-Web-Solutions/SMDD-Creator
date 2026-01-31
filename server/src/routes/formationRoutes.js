import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import Formation from '../models/Formation.js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';
import { generateAudio, saveAudioToTemp } from '../utils/elevenLabsService.js';
import { uploadAudioToHeyGen } from '../utils/heyGenService.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// @route   POST /api/formation/generate
// @desc    Generate a formation video (Script + HeyGen Video)
// @access  Private
router.post('/generate', async (req, res) => {
    try {
        const { title, subject, audience, tone, language, slideCount, slidePrompt } = req.body;
        const userId = req.user ? req.user.id : null;

        const mainSubject = subject || slidePrompt;
        if (!mainSubject) {
            return res.status(400).json({ error: "Le sujet de la formation est requis !" });
        }

        console.log(`Début de la génération de formation pour l'utilisateur ${userId}`);

        // 1. Retrieve User
        // 1. Retrieve User
        const user = await User.findById(userId);
        if (!user || !user.avatar) {
            return res.status(404).json({ error: "Avatar introuvable. Veuillez d'abord sélectionner ou générer un avatar." });
        }

        const avatarType = user.avatar.type || 'talking_photo'; // Default to legacy
        const avatarId = user.avatar.avatarId || user.avatar.talkingPhotoId;

        if (!avatarId) {
            return res.status(404).json({ error: "ID d'avatar introuvable." });
        }

        // 1.5 CHECK & DEDUCT CREDITS
        // 1.5 CHECK & DEDUCT CREDITS
        let COST = 100; // Default
        if (slideCount && typeof slideCount === 'string') {
            if (slideCount.includes('Moyen') || slideCount.includes('Medium')) COST = 150;
            else if (slideCount.includes('Long')) COST = 250;
            else COST = 100; // Court or fallback
        }

        if (user.credits < COST) {
            return res.status(403).json({
                error: "Crédits insuffisants",
                required: COST,
                current: user.credits
            });
        }

        // Deduct credits immediately
        user.credits -= COST;
        await user.save();
        console.log(`[CREDITS] Deducted ${COST} credits from user ${userId}. Remaining: ${user.credits}`);

        // 2. Determine Voice based on Gender
        // Strict mapping: Homme -> Henri (Male), Femme -> Coralie (Female)
        // Normalize gender string for comparison
        const userGender = (user.avatar.gender || 'Femme').toLowerCase();

        let voiceId;
        if (userGender === 'homme' || userGender === 'man' || userGender === 'male') {
            voiceId = "b32ea9471bb74ee688b75dde1e2ae6d7"; // Henri (French Male)
        } else {
            voiceId = "80f371302eaa4404870daa41dc62423c"; // Coralie (French Female - default)
        }

        // 3. Generate Content (Script + Slides) with OpenAI
        console.log("2. Génération du contenu structuré avec OpenAI...");

        // Optimized System Prompt for HeyGen + Educational Content
        const systemPrompt = `You are an expert pedagogical designer and scriptwriter for video courses.
Your task is to create a structured video course on: "${mainSubject}".

Target Audience: ${audience || 'General Public'}
Tone: ${tone || 'Professional & Engaging'}
Language: ${language || 'French'} (Must be valid ${language})
Approx Length: ${slideCount || '8 slides'}

CRITICAL OUTPUT STRUCTURE:
Return a STRICT JSON object containing a single array named 'sections'.
Each item in 'sections' represents ONE video scene (one slide + its specific script).

Structure for each section:
{
  "type": "intro" | "content" | "outro",
  "title": "Short Section Title",
  "script": "The spoken narration for this specific slide. Must be oral style, natural, short sentences, suitable for an AI avatar. Avoid 'In this slide...'. max 40 words.",
  "slide": {
    "title": "Slide Headline",
    "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
    "imagePrompt": "A highly detailed, photorealistic image depicting the core concept of this slide. Use concrete visual elements (e.g., 'a team of diverse professionals analyzing a graph on a tablet' instead of 'business concept'). Aesthetic: Cinematic lighting, professional, 4k."
  }
}

REQUIREMENTS:
1. "script" must be perfectly synchronized with the "slide" content.
2. The "intro" section should welcome the viewer.
3. The "outro" section should summarize and thank the viewer.
4. Total sections should match the requested length (~${slideCount}).
5. Ensure smooth transitions between sections in the script.
`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt }
            ],
            model: "gpt-3.5-turbo", // Switch to gpt-4-turbo if budget allows/needed for quality
            response_format: { type: "json_object" }
        });

        const generatedData = JSON.parse(completion.choices[0].message.content);
        const sections = generatedData.sections;

        if (!sections || !Array.isArray(sections)) {
            throw new Error("Invalid OpenAI response structure");
        }

        console.log(`Généré ${sections.length} sections.`);

        // 4. Concatenate Script for HeyGen Video
        // HeyGen generates one video file. content needs to be sequential.
        // We add small pauses between sections for natural flow.
        // Note: SSML tags like <break> might be read aloud by some voices. Using natural markers.
        // 4. Concatenate Script
        const fullScript = sections.map(s => s.script).join(" ... ");

        console.log("3. Génération de la vidéo avec HeyGen...");
        console.log(`Script complet (${fullScript.length} chars)`);

        // Construct Character Payload
        let characterPayload;
        if (avatarType === 'avatar') {
            characterPayload = {
                type: "avatar",
                avatar_id: avatarId,
                avatar_style: "normal"
            };
        } else {
            characterPayload = {
                type: "talking_photo",
                talking_photo_id: avatarId
            };
        }

        // PREPARE VOICE PAYLOAD (ElevenLabs or Native)
        let voicePayload;
        const requestedVoiceId = req.body.voiceId;

        if (requestedVoiceId) {
            console.log(`[ElevenLabs] Generating audio with voice ${requestedVoiceId}...`);
            try {
                // A. Generate Audio
                const audioBuffer = await generateAudio(fullScript, requestedVoiceId);

                // B. Save to Temp
                const { filepath } = await saveAudioToTemp(audioBuffer);
                console.log(`[ElevenLabs] Audio saved to ${filepath}`);

                // C. Upload to HeyGen
                const assetId = await uploadAudioToHeyGen(filepath);
                console.log(`[HeyGen] Audio Asset ID: ${assetId}`);

                // D. Cleanup Temp File (optional, doing it later or now)
                try { fs.unlinkSync(filepath); } catch (e) { }

                // E. Set Voice Payload
                voicePayload = {
                    type: "audio",
                    audio_asset_id: assetId
                };

            } catch (err) {
                console.error("ElevenLabs/HeyGen Audio Flow Failed:", err);
                return res.status(500).json({ error: "Echec de la génération audio (ElevenLabs)" });
            }
        } else {
            // FALLBACK TO NATIVE HEYGEN TTS
            console.log("[HeyGen] Using Native TTS");
            voicePayload = {
                type: "text",
                voice_id: voiceId, // Calculated earlier based on gender
                input_text: fullScript
            };
        }

        const videoGenerationResponse = await axios.post('https://api.heygen.com/v2/video/generate', {
            video_inputs: [
                {
                    character: characterPayload,
                    voice: voicePayload
                }
            ],
            dimension: {
                width: 1280,
                height: 720
            }
        }, {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const videoId = videoGenerationResponse.data.data.video_id;
        console.log("HeyGen Video ID:", videoId);

        // 5. Create Formation
        const newFormation = new Formation({
            userId: userId,
            title: title || `Formation: ${mainSubject.substring(0, 30)}...`,
            subject: mainSubject,
            audience,
            tone,
            language,
            expectedHeight: slideCount,
            videoId: videoId,
            status: 'pending',
            sections: sections, // Save the new structured data
            // Legacy support (optional, can be derived from sections if needed by old UI)
            slides: sections.map(s => s.slide),
            script: fullScript
        });

        await newFormation.save();
        console.log("Nouvelle formation créée:", newFormation._id);

        // Update User Avatar for Legacy Popup
        await User.findByIdAndUpdate(userId, {
            'avatar.videoId': videoId,
            'avatar.status': 'pending',
            'avatar.slides': sections.map(s => s.slide),
            'avatar.latestFormationId': newFormation._id
        });

        res.json({
            success: true,
            video_id: videoId,
            formation_id: newFormation._id
        });

    } catch (error) {
        const errorLog = `[${new Date().toISOString()}] Formation Generation Error: ${error.message}\nDetails: ${JSON.stringify(error.response ? error.response.data : {}, null, 2)}\n\n`;
        // Use fs (need to import it)
        try {
            const fs = await import('fs');
            fs.appendFileSync('server.log', errorLog);
        } catch (e) { console.error("Could not write to log file"); }

        console.error("Erreur génération formation:", error.response ? error.response.data : error.message);
        res.status(500).json({
            error: "Erreur lors de la génération de la formation",
            details: error.response ? error.response.data : error.message
        });
    }
});

// @route   GET /api/formation
// @desc    Get all formations for the logged in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        if (!userId) return res.status(401).json({ error: "Non autorisé" });

        const formations = await Formation.find({ userId }).sort({ createdAt: -1 });
        res.json(formations);
    } catch (error) {
        console.error("Erreur récupération formations:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// @route   GET /api/formation/:id
// @desc    Get specific formation
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        let formation = await Formation.findById(req.params.id);
        if (!formation) return res.status(404).json({ error: "Formation non trouvée" });

        // Check ownership (optional but recommended)
        // if (formation.userId.toString() !== req.user.id) ...

        // NEW: Check status if pending or videoUrl is missing but videoId exists
        if (formation.videoId && (!formation.videoUrl || formation.status === 'pending')) {
            try {
                console.log(`[DEBUG] Checking HeyGen status for ${formation.videoId}...`);
                const statusResponse = await axios.get(`https://api.heygen.com/v1/video_status.get?video_id=${formation.videoId}`, {
                    headers: { 'X-Api-Key': HEYGEN_API_KEY }
                });
                const data = statusResponse.data.data || statusResponse.data;
                console.log(`[DEBUG] HeyGen Response for ${formation.videoId}:`, JSON.stringify(data));

                if ((data.status === 'completed' || data.status === 'success') && data.video_url) {
                    console.log(`[SUCCESS] Video completed! Updating URL: ${data.video_url}`);
                    formation.videoUrl = data.video_url;
                    formation.status = 'completed';
                    await formation.save();
                } else if (data.status === 'failed') {
                    console.error("[FAILED] Video generation failed:", data.error);
                    formation.status = 'failed';
                    await formation.save();
                } else {
                    console.log(`[PENDING] Status: ${data.status}`);
                    // Still processing
                }
            } catch (err) {
                console.error("[ERROR] Failed to check video status:", err.message);
                if (err.response) console.error("[ERROR DETAILS]", err.response.data);
                // Don't fail the request, just return existing data
            }
        }

        res.json(formation);
    } catch (error) {
        console.error("Error getting formation:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Composite Download Endpoint
router.post('/download-composite', protect, async (req, res) => {
    try {
        const { videoUrl, slides } = req.body;
        // slides is array of { image: "data:image/png;base64,...", duration: 5 }

        if (!videoUrl || !slides || slides.length === 0) {
            return res.status(400).json({ error: "Missing videoUrl or slides" });
        }

        const tempDir = path.join(__dirname, '../../uploads/temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        // Save slide images to disk
        const slideFiles = [];
        for (let i = 0; i < slides.length; i++) {
            const matches = slides[i].image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) continue;

            const buffer = Buffer.from(matches[2], 'base64');
            const filePath = path.join(tempDir, `slide_${Date.now()}_${i}.png`);
            fs.writeFileSync(filePath, buffer);
            slideFiles.push({ path: filePath, duration: slides[i].duration });
        }

        const { composeVideo } = await import('../utils/videoComposer.js');
        const finalPath = await composeVideo(videoUrl, slideFiles, tempDir);

        res.download(finalPath, 'formation_composite.mp4', (err) => {
            if (err) console.error("Download error:", err);

            // Cleanup final file
            fs.unlink(finalPath, () => { });
            // Cleanup slide images
            slideFiles.forEach(s => fs.unlink(s.path, () => { }));
        });

    } catch (error) {
        console.error("Composite download failed:", error);
        res.status(500).json({ error: "Generation failed" });
    }
});

export default router;
