import express from 'express';
import * as authController from '../controllers/authController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-signin', authController.googleSignIn); // Google OAuth endpoint

// Protected routes
router.get('/me', protect, authController.getMe);
router.get('/logout', authController.logout);
router.put('/update-profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

export default router;
