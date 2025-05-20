import { z } from 'zod';

/**
 * チャットメッセージの役割
 */
export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

/**
 * チャットメッセージの型定義
 */
export interface ChatMessage {
  id?: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  userId: string;
  sessionId: string;
}

/**
 * 新規メッセージリクエストの型定義
 */
export interface SendMessageRequest {
  content: string;
  sessionId?: string;
}

/**
 * チャットレスポンスの型定義
 */
export interface ChatResponse {
  message: ChatMessage;
  sessionId: string;
}

/**
 * チャット履歴リクエストの型定義
 */
export interface ChatHistoryRequest {
  sessionId?: string;
  limit?: number;
}

/**
 * チャット履歴レスポンスの型定義
 */
export interface ChatHistoryResponse {
  messages: ChatMessage[];
  sessionId: string;
}