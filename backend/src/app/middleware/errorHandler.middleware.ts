import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../utils/errors';
import { logger } from '../lib/logger';
import { ZodError } from 'zod';

/**
 * グローバルエラーハンドリングミドルウェア
 * アプリケーション内で発生した例外をキャッチし、適切なエラーレスポンスを返します
 */
export const errorHandler = (
  err: Error | HttpError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`エラー発生: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // HttpErrorの場合
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode
    });
  }

  // ZodErrorの場合（バリデーションエラー）
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'リクエストデータが無効です',
      statusCode: 400,
      details: err.errors
    });
  }

  // その他のエラー
  return res.status(500).json({
    message: '内部サーバーエラーが発生しました',
    statusCode: 500
  });
};