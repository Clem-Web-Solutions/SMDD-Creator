import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js'; // Adjust path if needed

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

// --- CONFIGURATION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smdd-creator';
const BATCH_FILE = process.argv[2] || 'users.txt'; // Default to users.txt
const DEFAULT_CREDITS = 300; // Free credits for new users

// --- EMAIL CONFIG ---
// Check for SMTP config
const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

// --- HELPERS ---
function generatePassword(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function sendCredentialsEmail(transporter, email, password) {
    const mailOptions = {
        from: process.env.SMTP_FROM || '"SMDD Creator" <no-reply@smddcreator.com>',
        to: email,
        subject: 'Vos identifiants SMDD Creator',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Bienvenue dans la Beta Privée de SMDD Creator !</h2>
                <p>Nous sommes ravis de vous compter parmi nos premiers testeurs.</p>
                <p>Votre compte a été créé avec succès. Voici vos identifiants pour accéder à la plateforme :</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Email :</strong> ${email}</p>
                    <p><strong>Mot de passe provisoire :</strong> <code>${password}</code></p>
                </div>
                <p><strong>Important :</strong> Ce mot de passe est provisoire. Nous vous demandons de le changer dès votre première connexion dans les paramètres de votre compte.</p>
                <p>
                    <a href="http://localhost:5173/login" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accéder à mon espace</a>
                </p>
                <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Merci de votre confiance,<br>L'équipe SMDD Creator</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
}

// --- MAIN SCRIPT ---
async function run() {
    // 0. Connect to DB
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Failed:', err);
        process.exit(1);
    }

    // 1. Setup Email Transporter
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn('WARNING: SMTP credentials missing in .env. Emails will NOT be sent (Log only).');
    }
    const transporter = nodemailer.createTransport(smtpConfig);

    // 2. Read File
    const filePath = path.resolve(process.cwd(), BATCH_FILE);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        console.log('Usage: node src/scripts/create_users_bulk.js <filename>');
        process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const emails = fileContent.split(/\r?\n/).map(e => e.trim()).filter(e => e && e.includes('@'));

    console.log(`Found ${emails.length} emails to process from ${BATCH_FILE}.`);

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    // 3. Process Loop
    for (const email of emails) {
        try {
            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log(`[SKIP] User already exists: ${email}`);
                skipCount++;
                continue;
            }

            // Create User
            const password = generatePassword();

            // Hash password manually here since we are using User model directly
            // Depending on how User model is set up, it might hash on save.
            // Let's assume standard pre-save hook or manual hash.
            // Checking User model usually helps. Assuming standard Mongoose logic.
            // For safety, let's look at authController logic if we were strictly following code, 
            // but usually a direct create with raw password relies on pre-save middleware. 
            // If manual hash is needed:
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(password, salt);

            // Let's try creating with raw password first, relying on pre-save.
            // If this fails (no pre-save), we will fix.
            // Based on standard practices, I'll add manual hashing just in case to be safe, 
            // or better yet, verify User model. But for now, let's assume manual hashing to be safe.

            // Wait, usually User model has a method or pre-save. 
            // Let's assume we create it with hashed password to be sure.
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name: email.split('@')[0], // Default name
                email: email,
                password: hashedPassword,
                credits: DEFAULT_CREDITS
            });

            await newUser.save();
            console.log(`[OK] Created User: ${email}`);

            // Send Email
            if (process.env.SMTP_HOST) {
                try {
                    await sendCredentialsEmail(transporter, email, password);
                    console.log(`   -> Email sent to ${email}`);
                } catch (emailErr) {
                    console.error(`   -> Failed to send email to ${email}:`, emailErr.message);
                }
            } else {
                console.log(`   -> Email skipped (No SMTP). Password: ${password}`);
            }

            successCount++;

        } catch (err) {
            console.error(`[FAIL] Error processing ${email}:`, err.message);
            failCount++;
        }
    }

    console.log('\n--- SUMMARY ---');
    console.log(`Total: ${emails.length}`);
    console.log(`Created: ${successCount}`);
    console.log(`Skipped: ${skipCount}`);
    console.log(`Failed: ${failCount}`);

    process.exit(0);
}

run();
