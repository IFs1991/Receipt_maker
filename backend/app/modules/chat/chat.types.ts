import React from 'react';

const ChatTypes: React.FC = () => {
  return (
    <Card className="w-full bg-card">
      <CardHeader className="bg-card">
        <CardTitle className="bg-card">チャットタイプ</CardTitle>
        <CardDescription className="bg-card">チャットのスキーマとタイプ定義</CardDescription>
      </CardHeader>
      <CardContent className="bg-card">
        {/* コンテンツをここに配置 */}
      </CardContent>
    </Card>
  );
};

export default ChatTypes;