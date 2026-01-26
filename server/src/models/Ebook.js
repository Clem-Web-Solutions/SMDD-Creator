import mongoose from 'mongoose';

const ebookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    subtitle: {
        type: String,
        required: false
    },
    coverFont: {
        type: String,
        default: 'Inter'
    },
    language: {
        type: String,
        default: 'Français'
    },
    tone: {
        type: String,
        default: 'Professionnel'
    },
    length: {
        type: String,
        default: 'Moyen'
    },
    chapters: [{
        title: { type: String, required: true },
        content: { type: String, required: true }
    }],
    content: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['generating', 'completed', 'failed', 'draft'],
        default: 'generating'
    },
    coverUrl: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Ebook = mongoose.model('Ebook', ebookSchema);
export default Ebook;
