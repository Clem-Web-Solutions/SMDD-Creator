import express from 'express';
import { getMyEbooks, getEbookById, deleteEbook, getEbookStats, updateEbook } from '../controllers/ebookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyEbooks);
router.route('/stats').get(protect, getEbookStats);
router.route('/:id').get(protect, getEbookById).put(protect, updateEbook).delete(protect, deleteEbook);

export default router;
