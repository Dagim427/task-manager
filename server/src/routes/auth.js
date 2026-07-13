import express from 'express';
import { registerUser } from '../controller/authController.js';

const router = express.Router();

// Route: POST /api/auth/register
router.post('/register', registerUser);

export default router;