import { createClient } from '@supabase/supabase-js';
import { env } from '../config';
import { logger } from './logger';

// Supabaseクライアントを初期化する
const supabaseUrl = env.SUPABASE_URL || '';
const supabaseAnonKey = env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

// 環境変数のチェック
if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Supabase URLもしくはAnon Keyが設定されていません。');
}

// 公開クライアント（匿名キー使用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 管理者権限クライアント（サービスロールキー使用）- バックエンドのみで使用
let supabaseAdmin;
if (supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  logger.warn('SUPABASE_SERVICE_ROLE_KEYが設定されていないため、管理者権限の操作は利用できません。');
}

export { supabaseAdmin };