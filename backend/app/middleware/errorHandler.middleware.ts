import { Request, Response, NextFunction } from 'express';
import { HttpError, createErrorResponse, NotFoundError } from '../../utils/errors';
import { logger } from '../lib/logger';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

/**
 * グローバルエラーハンドリングミドルウェア
 * アプリケーション内で発生した例外をキャッチし、適切なエラーレスポンスを返します
 */
export const errorHandler = (
  err: Error | HttpError | ZodError | PrismaClientKnownRequestError | PrismaClientValidationError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  logger.error(`エラー発生: ${err.message}`, {
    error: err, // エラーオブジェクト全体をログに出力
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body, // リクエストボディもログに含める（センシティブ情報はマスクする等の考慮が必要）
    params: req.params,
    query: req.query,
  });

  if (err instanceof HttpError) {
    return res
      .status(err.statusCode)
      .json(createErrorResponse(err.statusCode, err.message));
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return res
      .status(400)
      .json(
        createErrorResponse(
          400,
          'リクエストデータの形式が無効です。入力内容を確認してください。',
          errors
        )
      );
  }

  if (err instanceof PrismaClientKnownRequestError) {
    // Prismaのエラーコードに応じた処理
    // @see https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    switch (err.code) {
      case 'P2000':
        return res
          .status(400)
          .json(
            createErrorResponse(
              400,
              `指定されたフィールドの値が長すぎます: ${err.meta?.target}`
            )
          );
      case 'P2001': // Record to update not found or condition not met
        return res
          .status(404)
          .json(createErrorResponse(404, '指定されたレコードが見つかりません。'));
      case 'P2002': // Unique constraint failed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const targetFields = (err.meta?.target as any[])?.join(', ') || String(err.meta?.target) || '指定されたフィールド';
        return res
          .status(409)
          .json(
            createErrorResponse(
              409,
              `${targetFields}の値は既に使用されています。別の値を指定してください。`
            )
          );
      case 'P2003': // Foreign key constraint failed
        return res
            .status(400)
            .json(
                createErrorResponse(
                    400,
                    `関連するデータが存在しないため、操作を完了できませんでした。入力内容を確認してください。フィールド: ${err.meta?.field_name}`
                )
            );
      case 'P2014': // The change you are trying to make would violate the required relation '{relation_name}' between the '{model_a_name}' and '{model_b_name}' models.
        return res
            .status(400)
            .json(
                createErrorResponse(
                    400,
                    `関連データの制約に違反するため、操作を完了できませんでした。モデル間の関連性を確認してください。(${err.meta?.relation_name} between ${err.meta?.model_a_name} and ${err.meta?.model_b_name})`
                )
            );
      case 'P2025': // An operation failed because it depends on one or more records that were required but not found.
        return res
          .status(404)
          .json(
            createErrorResponse(
              404,
              '操作に必要なレコードが見つかりませんでした。'
            )
          );
      default:
        logger.warn(`未対応のPrismaエラーコード: ${err.code}`, err);
        return res
          .status(500)
          .json(
            createErrorResponse(
              500,
              'データベース操作中に予期せぬエラーが発生しました。時間をおいて再度お試しください。'
            )
          );
    }
  }

  if (err instanceof PrismaClientValidationError) {
    logger.warn('Prismaバリデーションエラー', err);
    return res
      .status(400)
      .json(
        createErrorResponse(
          400,
          `データベース操作に必要なデータの形式または型が正しくありません。開発者にお問い合わせください。`
        )
      );
  }

  if (err instanceof Error && err.name === 'NotFoundError') {
     return res
      .status(404)
      .json(createErrorResponse(404, err.message || 'リソースが見つかりません。'));
  }

  logger.error('予期せぬ内部サーバーエラー', err);
  return res
    .status(500)
    .json(
      createErrorResponse(
        500,
        'サーバー内部で予期せぬエラーが発生しました。時間をおいて再度お試しいただくか、サポートにお問い合わせください。'
      )
    );
};