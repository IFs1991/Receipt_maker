import React from 'react';

const firebase: React.FC = () => {
  return (
    <Card className="w-full bg-card">
      <CardHeader className="bg-card">
        <CardTitle className="bg-card">Firebase Admin SDK 初期化</CardTitle>
        <CardDescription className="bg-card">Firebase Admin SDKの初期化設定を行います。</CardDescription>
      </CardHeader>
      <CardContent className="bg-card">
        <p>Firebase Admin SDKのサービスアカウントキーを使用して、Firebaseアプリを初期化します。</p>
        <p>サービスアカウントキーは、環境変数またはファイルパスから取得されます。</p>
      </CardContent>
    </Card>
  );
};

export default firebase;