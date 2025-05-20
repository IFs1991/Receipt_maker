import { PrismaClient } from '@prisma/client';
import { supabase, supabaseAdmin } from '../../lib/supabaseClient';
import { HttpError } from '../../../utils/errors';
import { AuthResponse, LoginUserDto, RegisterUserDto, UserResponse } from './auth.types';
import { logger } from '../../lib/logger';
import prisma from '../../database'; // シングルトン Prisma Client をインポート

// const prisma = new PrismaClient(); // ローカルインスタンス化を削除

/**
 * ユーザー登録
 * Supabase Authとデータベースの両方にユーザー情報を登録します
 */
export async function registerUser(data: RegisterUserDto): Promise<AuthResponse> {
  try {
    // Supabase Authにユーザーを登録
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.displayName
        }
      }
    });

    if (error) {
      logger.error('Supabase Auth ユーザー登録エラー:', error);
      throw new HttpError(400, error.message);
    }

    if (!authData.user) {
      throw new HttpError(400, 'ユーザー登録に失敗しました');
    }

    // データベースにユーザー情報を保存
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: data.email,
        supabaseUid: authData.user.id,
        displayName: data.displayName,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // レスポンスを整形して返す
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      displayName: user.displayName || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return {
      user: userResponse,
      session: authData.session ? {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at
      } : undefined
    };
  } catch (error) {
    logger.error('ユーザー登録エラー:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, '予期せぬエラーが発生しました');
  }
}

/**
 * ユーザーログイン
 * Supabase Authでログイン認証を行います
 */
export async function loginUser(data: LoginUserDto): Promise<AuthResponse> {
  try {
    // Supabase Authでログイン
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error) {
      logger.error('Supabase Auth ログインエラー:', error);
      throw new HttpError(401, '認証に失敗しました。メールアドレスまたはパスワードが正しくありません');
    }

    if (!authData.user || !authData.session) {
      throw new HttpError(401, 'ログインに失敗しました');
    }

    // ユーザー情報をデータベースから取得
    const user = await prisma.user.findUnique({
      where: { supabaseUid: authData.user.id }
    });

    if (!user) {
      // 存在しない場合は新規作成（Supabase Authに存在するが、DBに存在しない場合）
      logger.warn(`ユーザーがDBに存在しないため新規作成します: ${authData.user.id}`);

      const newUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email || '',
          supabaseUid: authData.user.id,
          displayName: authData.user.user_metadata?.display_name as string || '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          displayName: newUser.displayName || undefined,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        },
        session: {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
          expiresAt: authData.session.expires_at
        }
      };
    }

    // レスポンスを整形して返す
    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      session: {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at
      }
    };
  } catch (error) {
    logger.error('ログインエラー:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, '予期せぬエラーが発生しました');
  }
}

/**
 * パスワードリセットメールの送信
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL
    });

    if (error) {
      logger.error('パスワードリセットメール送信エラー:', error);
      throw new HttpError(400, error.message);
    }
  } catch (error) {
    logger.error('パスワードリセットメール送信エラー:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, '予期せぬエラーが発生しました');
  }
}

/**
 * ログアウト
 */
export async function logoutUser(accessToken: string): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error('ログアウトエラー:', error);
      throw new HttpError(400, error.message);
    }
  } catch (error) {
    logger.error('ログアウトエラー:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, '予期せぬエラーが発生しました');
  }
}