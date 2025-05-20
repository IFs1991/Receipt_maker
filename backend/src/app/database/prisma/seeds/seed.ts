import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Prismaクライアントのインスタンス化
const prisma = new PrismaClient();

/**
 * データベースシードスクリプト
 * 初期データをSupabase PostgreSQLデータベースに投入します
 */
async function main() {
  try {
    console.log('シードの実行を開始します...');

    // サンプルユーザーの作成（Supabase Authと連携）
    const user1 = await prisma.user.upsert({
      where: { email: 'testuser@example.com' },
      update: {},
      create: {
        id: uuidv4(), // UUIDを生成（Supabaseの形式に合わせる）
        email: 'testuser@example.com',
        supabaseUid: 'supabase-user-id-placeholder', // 実際のSupabase Auth UIDに置き換える
        displayName: 'テストユーザー',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });

    console.log('ユーザーシードデータが作成されました:', user1.id);

    // サンプルの類似事例データを作成
    const similarCase1 = await prisma.similarCase.upsert({
      where: { id: 'sample-case-1' },
      update: {},
      create: {
        id: 'sample-case-1',
        symptoms: '高血圧、めまい、頭痛',
        keyPoints: '3ヶ月以上続く症状。日常生活に支障をきたす程度。降圧剤による治療中。',
        approvalCategory: '生活習慣病',
        ageRange: '60-70',
        gender: 'male',
        insuranceType: '国民健康保険',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('類似事例シードデータが作成されました:', similarCase1.id);

    // サンプルチャットセッションとメッセージの作成
    const sessionId = uuidv4();
    const chatMessage1 = await prisma.chatMessage.create({
      data: {
        role: 'user',
        content: 'レセプト理由書の書き方について教えてください',
        userId: user1.id,
        sessionId,
        timestamp: new Date()
      }
    });

    const chatMessage2 = await prisma.chatMessage.create({
      data: {
        role: 'assistant',
        content: 'レセプト理由書は、医療機関が保険請求をするために必要な文書です。患者の症状、治療の必要性、治療内容などを明確に記載することが重要です。',
        userId: user1.id,
        sessionId,
        timestamp: new Date(Date.now() + 1000) // 1秒後
      }
    });

    console.log('チャットメッセージシードデータが作成されました:', chatMessage1.id, chatMessage2.id);

    console.log('シードデータの作成が完了しました');
  } catch (error) {
    console.error('シードデータの作成中にエラーが発生しました:', error);
    throw error;
  } finally {
    // Prisma接続をクローズ
    await prisma.$disconnect();
  }
}

// スクリプトの実行
main()
  .catch((e) => {
    console.error('シード実行エラー:', e);
    process.exit(1);
  });