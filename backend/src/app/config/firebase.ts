/**
 * Firebase設定ファイル
 *
 * このファイルは将来的に削除予定です。Supabaseへの移行に伴い、Firebaseの依存関係は段階的に削除されます。
 * 現在のコードベースとの互換性のために一時的に維持されています。
 */

// Firebase設定の型定義
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 環境変数から設定を読み込む関数
export function getFirebaseConfig(): FirebaseConfig | null {
  // 設定が環境変数にあるか確認
  // 将来的には設定を返さないようにし、このファイルは削除されます

  console.warn('警告: Firebaseは非推奨です。Supabaseへの移行を検討してください。');
  return null;
}

export default getFirebaseConfig;