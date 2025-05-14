import React from 'react';

const ValidationMiddleware: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800">
      <Card className="w-full bg-card mt-4">
        <CardHeader className="bg-card">
          <CardTitle className="bg-card">Zodバリデーションミドルウェア</CardTitle>
          <CardDescription className="bg-card">Zodを使用したリクエストバリデーションのミドルウェアファクトリ</CardDescription>
        </CardHeader>
        <CardContent className="bg-card">
          {/* コンテンツをここに配置 */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationMiddleware;