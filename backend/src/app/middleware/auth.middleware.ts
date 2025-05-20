import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabaseClient';
import { HttpError } from '../../utils/errors';

// リクエストオブジェクトに認証ユーザー情報を追加するための拡張インターフェース
export interface ExtendedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

/**
 * Supabase JWTトークンを検証するミドルウェア
 * Authorizationヘッダーから"Bearer "の後のトークンを取得し、Supabaseで検証します
 */
export const authenticate = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpError(401, '認証トークンがありません');
    }

    const accessToken = authHeader.split('Bearer ')[1];
    if (!accessToken) {
      throw new HttpError(401, '不正な認証トークンフォーマットです');
    }

    try {
      // Supabaseトークンを使用してユーザー情報を取得
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);

      if (error || !user) {
        throw new HttpError(401, 'トークンが無効または期限切れです');
      }

      req.user = {
        id: user.id,
        email: user.email,
        ...user
      };
      next();
    } catch (error: any) {
      // Supabase認証エラーのハンドリング
      console.error('Supabase認証エラー:', error);
      throw new HttpError(401, 'トークンが無効または期限切れです');
    }
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: '認証処理中に予期せぬエラーが発生しました' });
    }
  }
};