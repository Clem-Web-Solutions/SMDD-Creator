import express from 'express';
import ebookRoutes from '../api/generate/ebook.js';
import coverRoutes from '../api/generate/cover.js';
import authRoutes from './authRoutes.js';
import avatarRoutes from './avatarRoutes.js';
import ebookListRoutes from './ebookRoutes.js';
import formationRoutes from './formationRoutes.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

router.use('/auth', authRoutes);
router.use('/generate', [ebookRoutes, coverRoutes]);
router.use('/avatar', protect, avatarRoutes);
router.use('/formation', protect, formationRoutes);
router.use('/ebooks', ebookListRoutes);

export default router;
