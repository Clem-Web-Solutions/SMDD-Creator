import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import crypto from 'crypto';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const generatePassword = (length = 10) => {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
};

const createUser = async () => {
    await connectDB();

    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address');
        process.exit(1);
    }

    const password = generatePassword(10);
    const plan = 'pro';
    const credits = 1500;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists');
            process.exit(0);
        }

        const user = await User.create({
            name: email.split('@')[0], // Default name from email part
            email,
            password,
            plan,
            credits,
            mustChangePassword: true
        });

        console.log('-----------------------------------');
        console.log('User created successfully!');
        console.log(`Email: ${user.email}`);
        console.log(`Temporary Password: ${password}`);
        console.log(`Plan: ${user.plan}`);
        console.log(`Credits: ${user.credits}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createUser();
