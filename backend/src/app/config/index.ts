import dotenv from 'dotenv';
import path from 'path';

// .envファイルをロード
dotenv.config();

// 必須環境変数の一覧
const requiredEnvVars = [
  'PORT',
  'CORS_ORIGIN',
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
];

// 環境変数の存在チェック
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`警告: 環境変数 ${envVar} が設定されていません`);
  }
}

// 環境変数を型付きで提供
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  API_BASE_PATH: process.env.API_BASE_PATH || '/api/v1',
  DATABASE_URL: process.env.DATABASE_URL || '',

  // Firebase関連の環境変数 - 廃止予定 (Supabase移行後に削除予定)
  FIREBASE_SERVICE_ACCOUNT_KEY_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH,
  FIREBASE_SERVICE_ACCOUNT_KEY_BASE64: process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64,

  // Supabase関連の環境変数
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// process.envのアクセスを制限し、明示的に定義された環境変数のみを使用するように促進
export default env;