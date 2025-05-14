import React from 'react';

const Seed: React.FC = () => {
  return (
    <Card className="w-full bg-card">
      <CardHeader className="bg-card">
        <CardTitle className="bg-card">データベースシードスクリプト</CardTitle>
        <CardDescription className="bg-card">Prismaを使用して初期データをデータベースに投入します。</CardDescription>
      </CardHeader>
      <CardContent className="bg-card">
        <p>このスクリプトは、データベースに初期データを投入するために使用されます。`pnpm prisma:seed`コマンドで実行してください。</p>
        <p>例: サンプルユーザーを作成します。</p>
        <pre>
          <code>
            {`const user1 = await prisma.user.upsert({
  where: { email: 'testuser@example.com' },
  update: {},
  create: {
    email: 'testuser@example.com',
    firebaseUid: 'some-firebase-uid-for-testing',
    displayName: 'Test User',
  },
});`}
          </code>
        </pre>
        <p>他のモデル（PatientInfoなど）に必要なシードデータを追加してください。</p>
      </CardContent>
    </Card>
  );
};

export default Seed;