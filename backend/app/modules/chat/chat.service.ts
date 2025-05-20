import prisma from '../../database/index';
import { supabase } from '../../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  ChatMessage,
  ChatRole,
  SendMessageRequest,
  ChatResponse,
  ChatHistoryRequest,
  ChatHistoryResponse
} from './chat.types';
import { logger } from '../../lib/logger';
import { Prisma } from '@prisma/client';

/**
 * ユーザーからのメッセージを処理し、AIの応答を返す
 */
export async function processMessage(
  userId: string,
  messageData: SendMessageRequest
): Promise<ChatResponse> {
  // セッションIDがない場合は新規作成
  const sessionId = messageData.sessionId || uuidv4();

  // ユーザーメッセージを保存
  const userMessage: ChatMessage = {
    role: ChatRole.USER,
    content: messageData.content,
    timestamp: new Date(),
    userId,
    sessionId
  };

  // Prismaを使用してメッセージをデータベース（Supabase）に保存
  await prisma.chatMessage.create({
    data: {
      role: userMessage.role,
      content: userMessage.content,
      userId,
      sessionId
    }
  });

  // AIの応答を生成（実際の実装では外部AIサービスとの連携が必要）
  // ここでは簡易的な応答を返す
  const aiResponse: ChatMessage = {
    role: ChatRole.ASSISTANT,
    content: `あなたのメッセージ「${messageData.content}」を受け取りました。これはデモ応答です。`,
    timestamp: new Date(),
    userId,
    sessionId
  };

  // AIの応答をデータベースに保存
  await prisma.chatMessage.create({
    data: {
      role: aiResponse.role,
      content: aiResponse.content,
      userId,
      sessionId
    }
  });

  return {
    message: aiResponse,
    sessionId
  };
}

/**
 * ユーザーのチャット履歴を取得する
 */
export async function getChatHistory(
  userId: string,
  query: ChatHistoryRequest
): Promise<ChatHistoryResponse> {
  const { sessionId, limit = 50 } = query;

  // クエリ条件を構築
  const where: Prisma.ChatMessageWhereInput = { userId };
  if (sessionId) {
    where.sessionId = sessionId;
  }

  // Prismaを使用してチャットメッセージを取得
  const messages = await prisma.chatMessage.findMany({
    where,
    orderBy: {
      timestamp: 'asc'
    },
    take: limit
  });

  // 結果がない場合は新しいセッションIDを生成
  const resultSessionId = sessionId || messages[0]?.sessionId || uuidv4();

  return {
    messages: messages.map(msg => ({
      id: msg.id,
      role: msg.role as ChatRole,
      content: msg.content,
      timestamp: msg.timestamp,
      userId: msg.userId,
      sessionId: msg.sessionId
    })),
    sessionId: resultSessionId
  };
}