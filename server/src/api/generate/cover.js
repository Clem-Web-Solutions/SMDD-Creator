import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { protect } from '../../middleware/authMiddleware.js';
import Ebook from '../../models/Ebook.js';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/cover", protect, async (req, res) => {
    try {
        const {
            ebookId,
            title,
            subtitle,
            style,
            colors,
            audience
        } = req.body;

        // Optimisation pour la lisibilité du texte (Demande utilisateur)
        const prompt = `
        Rendu 3D PHOTORÉALISTE d'un livre (Ebook).
        
        TEXTE OBLIGATOIRE SUR LA COUVERTURE :
        - TITRE : "${title}"
        - SOUS-TITRE : "${subtitle || ''}"

        INSTRUCTION TYPOGRAPHIQUE CRITIQUE :
        Le texte "${title}" DOIT être écrit parfaitement, sans erreur, sans charabia.
        Utiliser une police moderne, grasse (Bold) et très lisible.
        Le texte est l'élément le plus important de l'image.
        
        STYLE VISUEL (MOCKUP PREMIUM) :
        - Type : Product Shot, Studio Photography, 8k Resolution.
        - Le livre doit avoir un aspect physique tangible (Ombres réalistes, épaisseur).
        - Éclairage : Cinématique, Dramatique.
        - Background : Neutre et sombre pour faire ressortir le titre.
        
        DESIGN :
        - Style : ${style || 'Moderne, Épuré, Professionnel'}.
        - Couleurs : ${colors || 'Contraste fort'}.
        
        INSTRUCTIONS NÉGATIVES :
        - PAS de fautes d'orthographe dans le titre.
        - PAS de texte flou ou illisible.
        - Pas de gribouillage (gibberish).
        `;

        const image = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            size: "1024x1792", // Vertical format for DALL-E 3
            quality: "standard",
            n: 1,
        });

        const imageUrl = image.data[0].url;

        // Optionally update the ebook directly if ID is provided
        if (ebookId) {
            await Ebook.findByIdAndUpdate(ebookId, { coverUrl: imageUrl });
        }

        res.json({
            success: true,
            imageUrl: imageUrl
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

export default router;