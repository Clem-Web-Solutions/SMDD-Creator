import express from 'express';
import { getVoices } from '../utils/elevenLabsService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/voices
// @desc    Get all available voices (ElevenLabs)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const voices = await getVoices();

        // Group by gender for easier frontend consumption
        const grouped = {
            masculine: voices.filter(v => v.gender === 'male' || v.gender === 'masculine' || !v.gender), // Fallback to masc if undefined? No, let's keep unknown separate or inspect.
            feminine: voices.filter(v => v.gender === 'female' || v.gender === 'feminine')
        };

        // If sorting needed
        grouped.masculine.sort((a, b) => a.name.localeCompare(b.name));
        grouped.feminine.sort((a, b) => a.name.localeCompare(b.name));

        res.json({
            success: true,
            voices: grouped,
            all: voices
        });
    } catch (error) {
        console.error("Error fetching voices:", error);
        res.status(500).json({ error: "Impossible de récupérer les voix" });
    }
});

export default router;
