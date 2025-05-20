import { z } from 'zod';
import { ChatRole } from './chat.types';

/**
 * チャットメッセージのZodスキーマ
 */
export const chatMessageSchema = z.object({
  content: z.string().min(1, { message: 'メッセージ内容は必須です' }),
  role: z.nativeEnum(ChatRole).optional().default(ChatRole.USER),
  sessionId: z.string().optional()
});

/**
 * 新規メッセージ送信リクエストのZodスキーマ
 */
export const sendMessageSchema = z.object({
  content: z.string().min(1, { message: 'メッセージ内容は必須です' }),
  sessionId: z.string().optional()
});

/**
 * チャット履歴取得リクエストのZodスキーマ
 */
export const chatHistorySchema = z.object({
  sessionId: z.string().optional(),
  limit: z.number().int().positive().optional().default(50)
});