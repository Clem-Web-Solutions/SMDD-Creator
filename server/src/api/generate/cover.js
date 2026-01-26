import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { protect } from '../../middleware/authMiddleware.js';
import Ebook from '../../models/Ebook.js';
import User from '../../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/cover", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.credits < 50) {
            return res.status(403).json({
                error: "Crédits insuffisants. Il vous faut 50 crédits.",
                required: 50,
                current: user.credits
            });
        }

        const {
            ebookId,
            title,
            subtitle,
            style,
            colors,
            audience
        } = req.body;

        // 1. "Smart Prompt" Generation using GPT-3.5-turbo
        // We ask GPT to act as an Art Director and create a specific DALL-E 3 prompt based on the book's subject.
        console.log(`Generating smart cover prompt for title: "${title}" with style: "${style}"`);

        // 1. "Smart Prompt" Generation using GPT-3.5-turbo/4o-mini
        console.log(`Generating smart cover prompt for title: "${title}" with style: "${style}"`);

        const systemInstruction = `
You are a Professional Photographer and Background Artist.
Your task is to write a text-to-image prompt for DALL-E 3 to create a HIGH-QUALITY, REALISTIC, and SIMPLE background image.

PRIORITY: The visual must be a LITERAL, REALISTIC representation of the book's vibe.
- If title is "Nature", generate a REAL FOREST or MOUNTAIN. Do not make it abstract.
- If title is "Business", generate a REAL OFFICE BLUR or CITY SKYLINE.

RULES:
- AVOID "Abstract" or "Surreal" art unless the title is specifically about dreams/magic.
- NO "weird" or "farfetched" elements. Keep it GROUNDED and CLASSY.
- COMPOSITION: Simple, clean, centered. Ample negative space.
- STYLE: Photorealistic or High-End Matte Painting.
- NO TEXT, NO BOOK OBJECTS.
- Aspect Ratio: Vertical.
`;

        const userMessage = `
Book Title: "${title}"
Subtitle: "${subtitle || ''}"
Requested Style: "${style || 'Modern'}"

Write a DALL-E 3 prompt for a vertical background image that matches this title and style. 
Keep it artistic, atmospheric, and free of text.
`;

        let smartPrompt;

        try {
            const promptGeneration = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemInstruction.trim() },
                    { role: "user", content: userMessage.trim() }
                ],
                temperature: 0.7,
            });

            smartPrompt = promptGeneration.choices[0].message.content.trim();
            console.log("Generated Smart Prompt:", smartPrompt);

            // Safety check: specific keywords indicating refusal
            if (smartPrompt.toLowerCase().includes("i'm sorry") || smartPrompt.toLowerCase().includes("cannot assist")) {
                console.warn("Smart Prompt rejected by model. Using fallback.");
                smartPrompt = null;
            }

        } catch (err) {
            console.error("Smart Prompt Generation Failed:", err);
            smartPrompt = null;
        }

        // Fallback if smart prompt failed
        if (!smartPrompt) {
            smartPrompt = `Atmospheric vertical background art, ${style || 'Abstract'} style, high quality, 8k resolution, suitable for text overlay, no text, no book objects.`;
        }

        // 2. Image Generation with DALL-E 3
        const image = await openai.images.generate({
            model: "dall-e-3",
            prompt: smartPrompt,
            size: "1024x1792",
            quality: "standard",
            n: 1,
        });

        const dallEUrl = image.data[0].url;

        // Download and Save Locally
        const timestamp = Date.now();
        const filename = `cover-${ebookId || 'temp'}-${timestamp}.png`;
        const uploadsDir = path.join(__dirname, '../../../public/uploads');

        // Ensure directory exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, filename);

        const imgResponse = await fetch(dallEUrl);
        if (!imgResponse.ok) throw new Error("Failed to download generated image");

        const arrayBuffer = await imgResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(filePath, buffer);

        // Local URL
        const localImageUrl = `http://localhost:3001/uploads/${filename}`;

        // Update user credits
        user.credits -= 50;
        await user.save();

        // Optionally update the ebook directly if ID is provided
        if (ebookId) {
            await Ebook.findByIdAndUpdate(ebookId, { coverUrl: localImageUrl });
        }

        res.json({
            success: true,
            imageUrl: localImageUrl
        });

    } catch (error) {
        console.error("Cover Generation Error:", error);
        res.status(500).json({
            error: "La génération de la couverture a échoué.",
            details: error.message
        });
    }
});

router.get("/cover/download/:ebookId", protect, async (req, res) => {
    try {
        const { ebookId } = req.params;
        const ebook = await Ebook.findById(ebookId);

        if (!ebook || !ebook.coverUrl) {
            return res.status(404).send("Cover not found");
        }

        const response = await fetch(ebook.coverUrl);
        if (!response.ok) throw new Error("Failed to fetch image from source");

        const contentType = response.headers.get("content-type") || "image/png";
        const buffer = await response.arrayBuffer();

        res.setHeader("Content-Disposition", `attachment; filename="cover-${ebook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png"`);
        res.setHeader("Content-Type", contentType);

        res.send(Buffer.from(buffer));

    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).send("Error downloading image");
    }
});

router.get("/cover/proxy/:ebookId", protect, async (req, res) => {
    try {
        const { ebookId } = req.params;
        const ebook = await Ebook.findById(ebookId);

        if (!ebook || !ebook.coverUrl) {
            return res.status(404).send("Cover not found");
        }

        const response = await fetch(ebook.coverUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!response.ok) {
            console.error(`Upstream fetch failed: ${response.status} ${response.statusText} for URL ${ebook.coverUrl}`);
            return res.status(response.status).send(`Upstream Error: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type") || "image/png";
        const settings = {
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=31536000", // Cache strictly if successful
                "Pragma": "cache",
                "Expires": "0"
            }
        };

        // Pipe the stream directly
        for (const [key, value] of Object.entries(settings.headers)) {
            res.setHeader(key, value);
        }

        const arrayBuffer = await response.arrayBuffer();
        res.send(Buffer.from(arrayBuffer));

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).send("Error proxying image");
    }
});

export default router;