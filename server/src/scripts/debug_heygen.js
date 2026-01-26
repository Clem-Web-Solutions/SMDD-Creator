import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Try loading from different possible paths to be sure
dotenv.config({ path: path.join(__dirname, '../../.env') });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Defined" : "Undefined");
console.log("HEYGEN_API_KEY:", process.env.HEYGEN_API_KEY ? "Defined" : "Undefined");

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function debug() {
    try {
        if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const user = await User.findOne({ 'avatar.talkingPhotoId': { $exists: true } });
        if (!user) {
            console.log("No user with talking photo found.");
            return;
        }

        console.log("Found User:", user.email);
        console.log("Avatar Gender:", user.avatar.gender);
        console.log("Talking Photo ID:", user.avatar.talkingPhotoId);

        const voiceId = (user.avatar.gender === 'Femme' || user.avatar.gender === 'Woman')
            ? "80f371302eaa4404870daa41dc62423c" // Coralie
            : "b32ea9471bb74ee688b75dde1e2ae6d7"; // Henri

        console.log("Selected Voice ID:", voiceId);

        const testScript = "Bonjour. Ceci est un test de génération avec des pauses. <break time='1.0s' /> Tout semble fonctionner.";

        console.log("Testing HeyGen Generation...");
        try {
            const resp = await axios.post('https://api.heygen.com/v2/video/generate', {
                video_inputs: [
                    {
                        character: {
                            type: "talking_photo",
                            talking_photo_id: user.avatar.talkingPhotoId
                        },
                        voice: {
                            type: "text",
                            voice_id: voiceId,
                            input_text: testScript
                        }
                    }
                ],
                dimension: { width: 1280, height: 720 }
            }, {
                headers: {
                    'X-Api-Key': HEYGEN_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Generation Success! Video ID:", resp.data.data.video_id);
        } catch (apiError) {
            console.error("HeyGen API Error:", apiError.response ? JSON.stringify(apiError.response.data, null, 2) : apiError.message);
        }

    } catch (err) {
        console.error("Script Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

debug();
