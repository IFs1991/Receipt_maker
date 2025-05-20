import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodType } from 'zod';
import { HttpError } from '../../utils/errors';

/**
 * Zodスキーマを使用してリクエストを検証するミドルウェアファクトリ関数
 * @param schema 検証に使用するZodスキーマ
 * @param source 検証するリクエストのソース（body, params, query）
 */
export const validate = <T extends ZodType<any, any, any>>(schema: T, source: 'body' | 'params' | 'query' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 指定されたソースに対してスキーマ検証を実行
      const data = await schema.parseAsync(req[source]);

      // 検証されたデータをリクエストオブジェクトに保持
      req[source] = data;

      next();
    } catch (error) {
      // ZodErrorの場合は400 Bad Request
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'バリデーションエラー',
          details: error.errors,
          statusCode: 400
        });
      }

      // その他のエラーは次のミドルウェアに渡す
      next(error);
    }
  };
};