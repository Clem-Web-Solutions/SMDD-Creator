import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        default: 'free',
        enum: ['free', 'pro', 'enterprise']
    },
    credits: {
        type: Number,
        default: 300
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: { type: String, default: 'talking_photo' }, // 'talking_photo' or 'avatar'
        avatarId: String, // ID for Studio Avatars
        name: String, // Name of the avatar
        videoId: String,
        description: String,
        gender: String, // 'Homme', 'Femme'
        generatedAt: Date,
        videoUrl: String,
        status: String,
        talkingPhotoId: String,
        previewUrl: String,
        slides: [{
            title: String,
            content: [String],
            imagePrompt: String
        }]
    },
    mustChangePassword: {
        type: Boolean,
        default: false
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
