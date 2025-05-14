import { Router } from 'express';
import { validateCreateFeedback, validateUpdateFeedback } from './feedback.validator';
import * as feedbackController from './feedback.controller';
import { authenticateUser } from '../../middleware/auth.middleware';

const router = Router();

// フィードバック作成エンドポイント
router.post('/', authenticateUser, validateCreateFeedback, feedbackController.createFeedback);

// フィードバック取得エンドポイント
router.get('/', authenticateUser, feedbackController.getFeedbacks);

// 特定のフィードバック取得エンドポイント
router.get('/:id', authenticateUser, feedbackController.getFeedbackById);

// フィードバック更新エンドポイント
router.put('/:id', authenticateUser, validateUpdateFeedback, feedbackController.updateFeedback);

// フィードバック削除エンドポイント
router.delete('/:id', authenticateUser, feedbackController.deleteFeedback);

export default router;