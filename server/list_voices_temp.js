import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

async function listVoices() {
    try {
        const response = await axios.get('https://api.heygen.com/v2/voices', {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY
            }
        });

        const voices = response.data.data.voices;
        console.log("Found", voices.length, "voices.");

        // Find a few English and French voices
        const frenchVoices = voices.filter(v => v.language === 'French' || v.language === 'French (France)');
        const englishVoices = voices.filter(v => v.language === 'English' || v.language === 'English (United States)');

        console.log("--- French Voices ---");
        frenchVoices.slice(0, 5).forEach(v => console.log(`${v.name} (${v.gender}): ${v.voice_id}`));

        console.log("--- English Voices ---");
        englishVoices.slice(0, 5).forEach(v => console.log(`${v.name} (${v.gender}): ${v.voice_id}`));

    } catch (error) {
        console.error("Error listing voices:", error.response ? error.response.data : error.message);
    }
}

listVoices();
