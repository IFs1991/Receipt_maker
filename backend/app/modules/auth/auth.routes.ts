import { Router } from 'express';
import { login, register, getMe, logout } from './auth.controller';
import { validateRequest } from '../../../middlewares/validateRequest';
import { loginSchema, registerSchema } from './auth.validator';
import { authenticate } from '../../../middlewares/authenticate'; // Firebase Admin SDK を使った認証ミドルウェアを想定

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post('/register', validateRequest(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Firebase ID token
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/login', validateRequest(loginSchema), login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, getMe);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout a user (client-side responsibility)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful (typically handled client-side by clearing token)
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, logout); // Backend might do session invalidation if using server-side sessions

export default router;