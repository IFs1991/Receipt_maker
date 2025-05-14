import React from 'react';

const AuthE2ETest: React.FC = () => {
  return (
    <Card className="w-full bg-card mt-4">
      <CardHeader className="bg-card">
        <CardTitle className="bg-card">認証エンドポイントのE2Eテスト</CardTitle>
        <CardDescription className="bg-card">認証エンドポイントのE2Eテストを実行します。</CardDescription>
      </CardHeader>
      <CardContent className="bg-card">
        {/* テスト結果をここに表示 */}
      </CardContent>
    </Card>
  );
};

export default AuthE2ETest;