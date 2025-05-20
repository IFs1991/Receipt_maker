import { z } from 'zod';

/**
 * ユーザー登録リクエストのスキーマ
 */
export const registerUserSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  password: z.string().min(8, { message: 'パスワードは8文字以上である必要があります' }),
  displayName: z.string().min(1, { message: '表示名は必須です' }),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;

/**
 * ログインリクエストのスキーマ
 */
export const loginUserSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  password: z.string().min(1, { message: 'パスワードは必須です' }),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;

/**
 * パスワードリセットリクエストのスキーマ
 */
export const resetPasswordSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

/**
 * ユーザー情報のインターフェース
 */
export interface UserResponse {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 認証レスポンスのインターフェース
 */
export interface AuthResponse {
  user: UserResponse;
  session?: {
    accessToken: string;
    refreshToken: string;
    expiresAt?: number;
  };
}

// Supabaseのセッション型
export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  user: SupabaseUser;
}

// Supabaseのユーザー型
export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
    [key: string]: any;
  };
  app_metadata?: any;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}