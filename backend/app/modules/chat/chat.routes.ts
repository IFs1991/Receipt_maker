import React from 'react';

const ChatRoutes: React.FC = () => {
  return (
    <Card className="w-full bg-card">
      <CardHeader className="bg-card">
        <CardTitle className="bg-card">AIアシスタントチャットルート</CardTitle>
        <CardDescription className="bg-card">AIアシスタントチャットのルート設定</CardDescription>
      </CardHeader>
      <CardContent className="bg-card">
        <p>このコンポーネントはAIアシスタントチャットのルートを設定します。</p>
      </CardContent>
    </Card>
  );
};

export default ChatRoutes;