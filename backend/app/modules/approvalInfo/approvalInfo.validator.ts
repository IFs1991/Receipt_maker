export * from './approvalInfo.types';

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CreateApprovalInfoDtoSchema } from './approvalInfo.types';

export const validateCreateApprovalInfo = (req: Request, res: Response, next: NextFunction) => {
  try {
    CreateApprovalInfoDtoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '入力データが無効です。',
        errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      });
    }
    // Handle other unexpected errors
    console.error('Unexpected error during approval info validation:', error);
    return res.status(500).json({ message: 'サーバー内部エラーが発生しました。' });
  }
};

// 必要に応じて、更新用のバリデーターもここに追加できます。
// export const validateUpdateApprovalInfo = (req: Request, res: Response, next: NextFunction) => { ... };