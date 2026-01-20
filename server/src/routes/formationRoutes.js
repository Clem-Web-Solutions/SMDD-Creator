import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import Formation from '../models/Formation.js';
import OpenAI from 'openai';

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
        const user = await User.findById(userId);
        if (!user || !user.avatar || !user.avatar.talkingPhotoId) {
            return res.status(404).json({ error: "Avatar introuvable. Veuillez d'abord générer un avatar." });
        }
        const talkingPhotoId = user.avatar.talkingPhotoId;

        // 2. Determine Voice based on Gender
        const userGender = user.avatar.gender || 'Femme'; // Default to Femme if missing
        const voiceId = (userGender === 'Femme' || userGender === 'Woman')
            ? "f9836c6e83964fb382756532cb896fd1" // Mathilde (French Female)
            : "57d7ad91fcdb41b49f3475b0bfd95034"; // Étienne (French Male)

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
    "imagePrompt": "Abstract, modern, minimalist background description related to the topic. High quality, 4k."
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
        const fullScript = sections.map(s => s.script).join(" <break time='1.0s' /> ");

        console.log("3. Génération de la vidéo avec HeyGen...");
        console.log(`Script complet (${fullScript.length} chars)`);

        const videoGenerationResponse = await axios.post('https://api.heygen.com/v2/video/generate', {
            video_inputs: [
                {
                    character: {
                        type: "talking_photo",
                        talking_photo_id: talkingPhotoId
                    },
                    voice: {
                        type: "text",
                        voice_id: voiceId,
                        input_text: fullScript
                    }
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
        const formation = await Formation.findById(req.params.id);
        if (!formation) return res.status(404).json({ error: "Formation non trouvée" });

        // Check ownership? 
        // if (formation.userId.toString() !== req.user.id) ...

        res.json(formation);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;
