import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, getProfile, updateProfile, changePassword } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], signup);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

export default router;
