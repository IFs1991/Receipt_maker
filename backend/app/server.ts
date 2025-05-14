import React from 'react';

const server: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800">
      <Card className="w-full bg-card mt-4">
        <CardHeader className="bg-card">
          <CardTitle className="bg-card">サーバーステータス</CardTitle>
          <CardDescription className="bg-card">サーバーの起動状態を表示します</CardDescription>
        </CardHeader>
        <CardContent className="bg-card">
          <p>サーバーが正常に起動しています。</p>
          <p>ポート: {process.env.PORT || 3001}</p>
          <p>APIベースパス: {process.env.API_BASE_PATH || '/api/v1'}</p>
          <p>環境: {process.env.NODE_ENV || 'development'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default server;