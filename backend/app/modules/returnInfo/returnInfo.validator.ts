// backend/app/modules/returnInfo/returnInfo.validator.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CreateReturnInfoDtoSchema } from './returnInfo.types';

export const validateCreateReturnInfo = (req: Request, res: Response, next: NextFunction) => {
  try {
    CreateReturnInfoDtoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: '入力データが無効です。',
        errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      });
    }
    // Handle other unexpected errors
    console.error('Unexpected error during return info validation:', error);
    return res.status(500).json({ message: 'サーバー内部エラーが発生しました。' });
  }
};

// 必要に応じて、更新用のバリデーターもここに追加できます。
// export const validateUpdateReturnInfo = (req: Request, res: Response, next: NextFunction) => { ... };