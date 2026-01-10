import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import OpenAI from 'openai';

dotenv.config();

const PORT = process.env.PORT || 5000;

// OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// Connect to Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
