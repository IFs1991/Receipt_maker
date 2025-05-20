import { Router } from 'express';
import * as feedbackController from './feedback.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createFeedbackSchema, updateFeedbackSchema } from './feedback.validator';

const router = Router();

// フィードバック作成エンドポイント
router.post('/',
  authenticate,
  validate(createFeedbackSchema),
  feedbackController.createFeedback
);

// フィードバック取得エンドポイント
router.get('/',
  authenticate,
  feedbackController.getFeedbacks
);

// 特定のフィードバック取得エンドポイント
router.get('/:id',
  authenticate,
  feedbackController.getFeedbackById
);

// フィードバック更新エンドポイント
router.put('/:id',
  authenticate,
  validate(updateFeedbackSchema),
  feedbackController.updateFeedback
);

// フィードバック削除エンドポイント
router.delete('/:id',
  authenticate,
  feedbackController.deleteFeedback
);

export default router;