import express from 'express';
import { authenticateUser } from '../middleware/auth';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
} from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authenticateUser, getProfile);
router.patch('/profile', authenticateUser, updateProfile);

export default router;