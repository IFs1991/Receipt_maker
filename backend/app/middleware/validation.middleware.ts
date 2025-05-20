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
      // (注意: req[source]を上書きすると、後続のミドルウェアやルートハンドラで元の未検証データにアクセスできなくなる)
      // 必要であれば、req.validatedData = data; のように別のプロパティに格納することも検討。
      // 今回はシンプルに上書きする。
      req[source] = data;

      next();
    } catch (error) {
      // ZodErrorの場合、共通エラーハンドラに処理を委譲
      if (error instanceof ZodError) {
        return next(error); // 共通エラーハンドラで処理される
      }
      // その他の予期せぬエラーも共通エラーハンドラへ
      next(error);
    }
  };
};