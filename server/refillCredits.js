import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const refillCredits = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Set credits to 5000 (Generous amount for testing)
        const result = await User.updateMany({}, { $set: { credits: 5000 } });
        console.log(`Updated ${result.modifiedCount} users. Credits set to 5000.`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

refillCredits();
