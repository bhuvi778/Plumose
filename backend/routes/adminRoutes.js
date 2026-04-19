import express from 'express';
import { getStats, listUsers } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, admin);
router.get('/stats', getStats);
router.get('/users', listUsers);
export default router;
