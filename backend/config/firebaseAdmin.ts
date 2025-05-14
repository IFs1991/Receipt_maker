import * as admin from 'firebase-admin';

// 環境変数からサービスアカウントキーのパスを取得
// 例: GOOGLE_APPLICATION_CREDENTIALS="path/to/your/serviceAccountKey.json"
// この環境変数を設定するか、以下のserviceAccountPathを直接指定してください。
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!admin.apps.length) {
  if (!serviceAccountPath) {
    console.error('Firebase Admin SDK: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    // 開発環境など、サービスアカウントなしで初期化を試みる場合（エミュレータ等）は、
    // 以下のコメントアウトを解除し、適切な設定を行ってください。
    // admin.initializeApp();
    // ただし、本番環境ではサービスアカウントキーが必須です。
    // ここではエラーをスローするか、限定的な機能で動作するようにフォールバックする可能性があります。
    // 今回は初期化せずに進みますが、実際の運用ではエラー処理が必要です。
    console.warn('Firebase Admin SDK not initialized due to missing service account. Authentication will not work.');
  } else {
    try {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com' // 必要な場合
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      console.error('Please ensure the service account key file path is correct and the file is valid JSON.');
    }
  }
} else {
  // console.log('Firebase Admin SDK already initialized.');
}

export { admin };