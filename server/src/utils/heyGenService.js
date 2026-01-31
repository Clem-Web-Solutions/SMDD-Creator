import axios from 'axios';
import fs from 'fs';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export const uploadAudioToHeyGen = async (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);

        console.log(`Uploading audio ${filePath} to HeyGen (Raw Binary)...`);

        const response = await axios.post('https://upload.heygen.com/v1/asset', fileBuffer, {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY,
                'Content-Type': 'audio/mpeg'
            }
        });

        const assetId = response.data.data.id;
        console.log(`HeyGen Asset Uploaded: ${assetId}`);

        return assetId;

    } catch (error) {
        console.error("HeyGen Upload Error:", error.response ? error.response.data : error.message);
        throw new Error("Failed to upload audio to HeyGen");
    }
};
