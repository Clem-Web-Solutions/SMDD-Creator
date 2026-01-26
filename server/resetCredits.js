import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const resetCredits = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const result = await User.updateMany({}, { $set: { credits: 0 } });
        console.log(`Updated ${result.modifiedCount} users. Credits set to 0.`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetCredits();
