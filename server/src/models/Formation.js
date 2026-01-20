import mongoose from 'mongoose';

const formationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Nouvelle Formation'
    },
    subject: {
        type: String,
        required: true
    },
    audience: String,
    tone: String,
    language: String,
    expectedHeight: String, // slideCount value
    status: {
        type: String,
        enum: ['draft', 'pending', 'completed'],
        default: 'pending'
    },
    videoId: {
        type: String // HeyGen Video ID for the presentation
    },
    videoUrl: {
        type: String // Completed video URL
    },
    previewUrl: {
        type: String // Thumbnail
    },
    slides: [{
        title: String,
        content: [String],
        imagePrompt: String
    }],
    sections: [{
        type: { type: String, enum: ['intro', 'content', 'transition', 'outro'], default: 'content' },
        title: String,
        script: String,
        slide: {
            title: String,
            content: [String],
            imagePrompt: String
        }
    }],
    script: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Formation = mongoose.model('Formation', formationSchema);
export default Formation;
