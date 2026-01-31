import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const BASE_URL = 'https://api.elevenlabs.io/v1';

export const getVoices = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/voices`, {
            headers: {
                'xi-api-key': ELEVEN_LABS_API_KEY
            }
        });

        // Return voices mapped to a simpler structure
        // Filter or categorize if needed
        return response.data.voices.map(v => ({
            voice_id: v.voice_id,
            name: v.name,
            gender: v.labels?.gender,
            preview_url: v.preview_url,
            category: v.category
        }));
    } catch (error) {
        console.error("ElevenLabs Get Voices Error:", error.message);
        throw error;
    }
};

export const generateAudio = async (text, voiceId) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/text-to-speech/${voiceId}`,
            {
                text: text,
                model_id: "eleven_multilingual_v2", // Best for French
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            },
            {
                headers: {
                    'xi-api-key': ELEVEN_LABS_API_KEY,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer' // Important for binary
            }
        );

        return response.data; // Buffer
    } catch (error) {
        console.error("ElevenLabs Generation Error:", error.message);
        throw error;
    }
};

// Helper to save audio to a public temp file
export const saveAudioToTemp = async (audioBuffer) => {
    const tempDir = path.join(__dirname, '../../public/temp_audio');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const filename = `audio_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
    const filePath = path.join(tempDir, filename);

    fs.writeFileSync(filePath, audioBuffer);

    // Return relative path or absolute if needed? 
    // Usually we need the public URL. 
    // Assuming 'public' is served statically.
    return {
        filepath: filePath,
        filename: filename
    };
};
