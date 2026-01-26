import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const VIDEO_ID = 'b39756e80fbc43a98f860af288ad1dff';

async function checkStatus() {
    try {
        console.log(`Checking status for video ${VIDEO_ID}...`);
        const response = await axios.get(`https://api.heygen.com/v1/video_status.get?video_id=${VIDEO_ID}`, {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY
            }
        });

        console.log("Status Response:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

checkStatus();
