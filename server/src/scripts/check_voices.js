import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

async function listVoices() {
    try {
        console.log('Fetching voices...');
        const response = await axios.get('https://api.heygen.com/v2/voices', {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY
            }
        });

        const voices = response.data.data.voices;
        const frenchVoices = voices.filter(v => v.language && v.language.toLowerCase().includes('french'));

        console.log(`Found ${frenchVoices.length} French voices:`);
        frenchVoices.forEach(v => {
            console.log(`- ${v.name} (${v.gender}): ${v.voice_id} [${v.language}]`);
        });

    } catch (error) {
        console.error('Error fetching voices:', error.response ? error.response.data : error.message);
    }
}

listVoices();
