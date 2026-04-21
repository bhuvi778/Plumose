import express from 'express';
import { register, login, me, updateProfile, setupAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/setup-admin', setupAdmin);
router.get('/me', protect, me);
router.put('/me', protect, updateProfile);
export default router;
