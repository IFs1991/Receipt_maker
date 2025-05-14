/**
 * Firebase から Supabase へユーザーを移行するためのスクリプト
 *
 * 使用方法:
 * 1. 必要な環境変数を設定:
 *   - FIREBASE_SERVICE_ACCOUNT_KEY_PATH or FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - DATABASE_URL (Prisma用)
 *
 * 2. 実行:
 *   $ ts-node migrate-firebase-to-supabase.ts
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// 環境変数のロード
dotenv.config();

// Firebase Adminは必要な場合にのみインポート
let admin: any;
try {
  admin = require('firebase-admin');
} catch (error) {
  console.error('firebase-adminパッケージが見つかりません。必要に応じてインストールしてください。');
  console.error('npm install firebase-admin');
  process.exit(1);
}

// Firebase Admin SDKの初期化
const initializeFirebaseAdmin = () => {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;

  if (!serviceAccountPath && !serviceAccountBase64) {
    console.error('Firebase Admin SDKの認証情報が設定されていません。');
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH または FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 を設定してください。');
    process.exit(1);
  }

  try {
    if (serviceAccountBase64) {
      // Base64エンコードされたサービスアカウントキーを使用
      const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else if (serviceAccountPath) {
      // ファイルパスからサービスアカウントキーを使用
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    console.log('Firebase Admin SDKが初期化されました。');
  } catch (error) {
    console.error('Firebase Admin SDKの初期化に失敗しました:', error);
    process.exit(1);
  }
};

// Supabase クライアントの初期化
const initializeSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase接続情報が設定されていません。');
    console.error('SUPABASE_URL および SUPABASE_SERVICE_ROLE_KEY を設定してください。');
    process.exit(1);
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

// Prismaクライアントの初期化
const initializePrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('DATABASE_URLが設定されていません。');
    process.exit(1);
  }

  return new PrismaClient();
};

/**
 * ユーザー移行のメイン処理
 */
const migrateUsers = async () => {
  console.log('Firebaseユーザーデータの移行を開始します...');

  // 各種クライアントの初期化
  initializeFirebaseAdmin();
  const supabase = initializeSupabaseClient();
  const prisma = initializePrismaClient();

  try {
    // Firebaseからユーザーリストを取得（最大1000ユーザー）
    // 1000ユーザー以上の場合はページネーションが必要
    console.log('Firebaseからユーザーリストを取得中...');
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users;
    console.log(`${users.length}人のユーザーが見つかりました。`);

    // 各ユーザーを処理
    let successCount = 0;
    let errorCount = 0;

    for (const firebaseUser of users) {
      try {
        console.log(`Processing user: ${firebaseUser.email}`);

        // Supabaseにユーザーをインポート
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
          email: firebaseUser.email,
          email_confirm: firebaseUser.emailVerified,
          user_metadata: {
            display_name: firebaseUser.displayName || '',
            // その他のメタデータをここに追加
          },
          // パスワードは移行できないためランダムな文字列を設定
          // 後でパスワードリセットが必要
          password: Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2),
        });

        if (userError) {
          console.error(`ユーザー作成エラー (${firebaseUser.email}):`, userError);
          errorCount++;
          continue;
        }

        // Prismaデータベースのユーザーレコードを更新
        // firebaseUid から supabaseId に変更
        try {
          const dbUser = await prisma.user.findFirst({
            where: { email: firebaseUser.email },
          });

          if (dbUser) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                supabaseId: userData.user.id,
              },
            });
            console.log(`DBユーザー更新 (${firebaseUser.email}): OK`);
          } else {
            console.log(`ユーザー ${firebaseUser.email} はデータベースに存在しません。スキップします。`);
          }
        } catch (dbError) {
          console.error(`DBユーザー更新エラー (${firebaseUser.email}):`, dbError);
        }

        successCount++;
      } catch (userError) {
        console.error(`ユーザー処理エラー (${firebaseUser.email}):`, userError);
        errorCount++;
      }
    }

    console.log('移行完了!');
    console.log(`成功: ${successCount}件, 失敗: ${errorCount}件`);

    // パスワードリセットの案内
    console.log('\n重要: ユーザーにパスワードリセットを案内してください。');
    console.log('セキュリティ上の理由から、パスワードハッシュは移行されません。');
    console.log('各ユーザーはパスワードリセットフローを通じて新しいパスワードを設定する必要があります。');

  } catch (error) {
    console.error('移行処理中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// スクリプト実行
migrateUsers().catch(error => {
  console.error('移行スクリプト実行エラー:', error);
  process.exit(1);
});