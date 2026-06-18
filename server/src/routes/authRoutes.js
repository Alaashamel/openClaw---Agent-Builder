import { Router } from 'express';
import { login, loginSchema, me, register, registerSchema } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);
export default router;
