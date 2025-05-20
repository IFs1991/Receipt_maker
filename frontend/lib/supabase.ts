import { createClient } from '@supabase/supabase-js';

// SupabaseのURLとAPIキーを環境変数から取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 環境変数が設定されていない場合の警告
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URLもしくはAnon Keyが設定されていません。');
}

// Supabaseクライアントの作成
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;