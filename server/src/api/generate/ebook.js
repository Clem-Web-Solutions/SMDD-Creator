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

        const prompt = `Tu es un expert reconnu en rédaction de livres pédagogiques de haute qualité (style éditorial, complet et engageant).
        
        TA MISSIONS :
        Rédiger un Ebook complet sur le sujet : "${subject}" (Titre : ${title}).
        
        INSTRUCTIONS STRICTES DE STRUCTURE :
        1. Tu dois répondre UNIQUEMENT avec un objet JSON valide.
        2. Format JSON attendu : { "chapters": [ { "title": "...", "content": "..." } ] }
        3. Génère EXACTEMENT ${targetChapterCount} chapitres.
        
        QUALITÉ DU CONTENU (CRITIQUE pour l'utilisateur) :
        - Le contenu NE DOIT PAS être générique ou superficiel.
        - Chaque chapitre doit être RICHE, DENSE et PRATIQUE (minimum 400 mots par chapitre).
        - Structure OBLIGATOIRE pour le contenu de CHAQUE chapitre (en HTML) :
          a) <h2>Introduction</h2> : Accroche contextuelle.
          b) <h2>Concepts Clés</h2> : Explication approfondie, nuances, définitions.
          c) <h2>Exemple Concret</h2> : Un cas pratique, une anecdote ou une mise en situation réelle pour illustrer.
          d) <h2>Conseils Pratiques</h2> : Une liste à puces (<ul>) de recommandations actionnables.
          e) <h2>Conclusion</h2> : Résumé et transition.
        
        - Utilise un ton : "${tone}".
        - Langue : ${language}.
        - N'utilise pas de balises <html>, <head> ou <body>, juste le contenu (h2, p, ul, strong).
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Upgraded for better reasoning and content richness
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "Tu es un auteur expert. Tu génères du contenu riche, détaillé et structuré en JSON." },
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