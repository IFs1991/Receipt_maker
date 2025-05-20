import { Router } from 'express';
import * as chatController from './chat.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { sendMessageSchema, chatHistorySchema } from './chat.validator';

const router = Router();

// チャットメッセージ送信エンドポイント
router.post(
  '/messages',
  authenticate,
  validate(sendMessageSchema),
  chatController.sendMessage
);

// チャット履歴取得エンドポイント
router.get(
  '/history',
  authenticate,
  chatController.getChatHistory
);

export default router;