import React from 'react';

const ChatService: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800">
      <Card className="w-full bg-card">
        <CardHeader className="bg-card">
          <CardTitle className="bg-card">AIアシスタントチャットサービス</CardTitle>
          <CardDescription className="bg-card">AIアシスタントとのチャットを管理します。</CardDescription>
        </CardHeader>
        <CardContent className="bg-card">
          {/* コンテンツをここに配置 */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatService;