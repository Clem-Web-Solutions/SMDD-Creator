import express from 'express';
import ebookRoutes from '../api/generate/ebook.js';
import authRoutes from './authRoutes.js';
import ebookListRoutes from './ebookRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

router.use('/auth', authRoutes);
router.use('/generate', ebookRoutes);
router.use('/ebooks', ebookListRoutes);

export default router;
