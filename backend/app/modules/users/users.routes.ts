import { Router } from 'express';
import * as userController from './users.controller';
import { authenticate } from '../../middleware/auth.middleware'; // Corrected import path
import { validate } from '../../middleware/validation.middleware'; // Use 'validate' from the correct path
import { updateUserProfileSchema, updateInjuryCauseSchema } from './users.validator'; // バリデーションスキーマをインポート

const router = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/me', authenticate, userController.getCurrentUserProfile);

/**
 * @openapi
 * /users/me/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update current user's profile (including patient info)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserProfileInput' // PatientInfoFormState に対応するスキーマを想定
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/me/profile', authenticate, validate(updateUserProfileSchema, 'body'), userController.updateCurrentUserProfile);

// Add other user-related routes here if needed
// Example: Get user by ID (for admin purposes, if any)
// router.get('/:userId', authenticate, userController.getUserProfileById); // Needs appropriate authorization

/**
 * @openapi
 * /users/me/injury-cause:
 *   post:
 *     tags:
 *       - Users
 *     summary: Update or create current user's injury cause
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInjuryCauseInput'
 *     responses:
 *       200:
 *         description: Injury cause updated/created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InjuryCauseResponse' // InjuryCauseモデルに対応するレスポンススキーマを想定
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/me/injury-cause', authenticate, validate(updateInjuryCauseSchema, 'body'), userController.updateUserInjuryCause);

export default router;