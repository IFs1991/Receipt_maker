export * from './feedback.types';

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CreateFeedbackDtoSchema, UpdateFeedbackDtoSchema } from './feedback.types';

export const validateCreateFeedback = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 拒否の場合は理由が必要
    if (req.body.status === 'rejected' && !req.body.rejectionReason) {
      return res.status(400).json({
        message: '拒否の場合は理由を入力してください。',
      });
    }

    // スキーマバリデーション
    CreateFeedbackDtoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '入力データが無効です。',
        errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      });
    }
    console.error('Unexpected error during feedback validation:', error);
    return res.status(500).json({ message: 'サーバー内部エラーが発生しました。' });
  }
};

export const validateUpdateFeedback = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 拒否に変更する場合は理由が必要
    if (req.body.status === 'rejected' && !req.body.rejectionReason) {
      return res.status(400).json({
        message: '拒否の場合は理由を入力してください。',
      });
    }

    // スキーマバリデーション
    UpdateFeedbackDtoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '入力データが無効です。',
        errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      });
    }
    console.error('Unexpected error during feedback validation:', error);
    return res.status(500).json({ message: 'サーバー内部エラーが発生しました。' });
  }
};