import { z } from 'zod';

// ユーザー登録入力のバリデーションスキーマ
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('無効なメールアドレスです'),
    password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
    displayName: z.string().min(1, '表示名は必須です'),
  }),
});
export type RegisterInput = z.infer<typeof registerSchema>['body'];

// ユーザーログイン入力のバリデーションスキーマ
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('無効なメールアドレスです'),
    password: z.string().min(1, 'パスワードは必須です'),
  }),
});
export type LoginInput = z.infer<typeof loginSchema>['body'];

// ユーザーレスポンスの型（パスワードハッシュなどの機密データを除外）
export interface UserResponse {
  id: string;
  supabaseId: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
  injuryCause?: any;
  [key: string]: any;
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