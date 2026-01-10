import express from 'express';
import { getMyEbooks, getEbookById, deleteEbook } from '../controllers/ebookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyEbooks);
router.route('/:id').get(protect, getEbookById).delete(protect, deleteEbook);

export default router;
