import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { protect } from '../../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

import Ebook from '../../models/Ebook.js';
import User from '../../models/User.js';

router.post("/ebook", protect, async (req, res) => {
    try {
        const { title, subject, language, tone, length } = req.body;

        if (!title || !subject) {
            return res.status(400).json({ message: "Titre et sujet sont requis !" });
        }

        // Determine chapter count based on length selection
        let targetChapterCount = 10; // Default
        let requiredCredits = 150; // Default "Moyen"

        if (length && length.includes("5-10")) {
            targetChapterCount = 7;
            requiredCredits = 100;
        }
        else if (length && length.includes("15")) {
            targetChapterCount = 15;
            requiredCredits = 150;
        }
        else if (length && length.includes("30")) {
            targetChapterCount = 25; // Cap at 25 to avoid timeouts
            requiredCredits = 250;
        }

        const user = req.user; // Use authenticated user

        // CHECK CREDITS
        if (user.credits < requiredCredits) {
            return res.status(403).json({
                error: "Crédits insuffisants",
                required: requiredCredits,
                current: user.credits
            });
        }

        // DEDUCT CREDITS (Optimistic deduction)
        user.credits -= requiredCredits;
        await user.save();

        const prompt = `Tu es un expert en rédaction d'ebooks pédagogiques.
        Génère un PLAN DÉTAILLÉ et le CONTENU COMPLET pour un ebook sur le sujet : "${subject}" (Titre : ${title}).
        
        INSTRUCTIONS OBLIGATOIRES :
        1. Tu dois répondre UNIQUEMENT avec un objet JSON valide.
        2. La structure du JSON doit être : { "chapters": [ { "title": "...", "content": "..." } ] }
        3. Génère EXACTEMENT ${targetChapterCount} chapitres distincts (pour faire un ebook de ${targetChapterCount} pages).
        4. Le contenu de chaque chapitre doit être formaté en HTML (h2, p, ul, strong) mais SANS <html> ni <body>, juste le corps du texte.
        5. Sois très verbeux, développe les idées en profondeur.
        
        Langue: ${language}
        Ton: ${tone}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106", // Supports JSON mode
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "Tu es un assistant qui génère toujours du JSON valide." },
                { role: "user", content: prompt }
            ]
        });

        let generatedContent;
        try {
            generatedContent = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            console.error("Failed to parse JSON", e);
            throw new Error("Erreur de formatage de l'ebook généré");
        }

        const newEbook = await Ebook.create({
            userId: user._id,
            title,
            subject,
            language,
            tone,
            length,
            chapters: generatedContent.chapters, // Use structured chapters
            status: 'completed'
        });

        res.json({ ebook: newEbook });

    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ error: "Erreur de génération de l'ebook", details: error.message });
    }
});

export default router;