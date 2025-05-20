import * as chatService from '../../../app/modules/chat/chat.service';
import prisma from '../../../app/database'; // setup.ts でモックされる Prisma Client
import { v4 as uuidv4 } from 'uuid';
// chat.types.ts から型をインポート
import {
  ChatRole,
  SendMessageRequest,
  ChatHistoryRequest,
  // ChatMessage as AppChatMessage // サービス内のChatMessage型と区別する場合
} from '../../../app/modules/chat/chat.types';
// Prisma Client から生成される型 (スキーマ定義に依存)
// import { ChatMessage as PrismaChatMessage } from '@prisma/client'; //一旦コメントアウト

// uuid をモック化
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const mockUserId = 'test-user-id';
const mockSessionId = 'test-session-id';
const fixedUuid = 'fixed-uuid-for-tests';

describe('Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue(fixedUuid); // 各テスト前にuuidv4の戻り値を固定
  });

  describe('processMessage', () => {
    const messageData: SendMessageRequest = {
      content: 'こんにちは',
    };

    it('新しいセッションIDでメッセージが正しく処理・保存されること', async () => {
      (prisma.chatMessage.create as jest.Mock).mockResolvedValue({}); // 2回呼ばれる想定

      const result = await chatService.processMessage(mockUserId, messageData);

      expect(uuidv4).toHaveBeenCalledTimes(1); // sessionIdが指定されていない場合のみ呼ばれる
      expect(prisma.chatMessage.create).toHaveBeenCalledTimes(2);
      expect(prisma.chatMessage.create).toHaveBeenNthCalledWith(1, {
        data: {
          role: ChatRole.USER,
          content: messageData.content,
          userId: mockUserId,
          sessionId: fixedUuid,
        },
      });
      expect(prisma.chatMessage.create).toHaveBeenNthCalledWith(2, {
        data: {
          role: ChatRole.ASSISTANT,
          content: `あなたのメッセージ「${messageData.content}」を受け取りました。これはデモ応答です。`,
          userId: mockUserId,
          sessionId: fixedUuid,
        },
      });

      expect(result.sessionId).toBe(fixedUuid);
      expect(result.message.role).toBe(ChatRole.ASSISTANT);
      expect(result.message.content).toContain(messageData.content);
    });

    it('既存のセッションIDでメッセージが正しく処理・保存されること', async () => {
      (prisma.chatMessage.create as jest.Mock).mockResolvedValue({});
      const messageDataWithSession: SendMessageRequest = { ...messageData, sessionId: mockSessionId };

      const result = await chatService.processMessage(mockUserId, messageDataWithSession);

      expect(uuidv4).not.toHaveBeenCalled(); // sessionIdが指定されている場合は呼ばれない
      expect(prisma.chatMessage.create).toHaveBeenCalledTimes(2);
      expect(prisma.chatMessage.create).toHaveBeenNthCalledWith(1, {
        data: {
          role: ChatRole.USER,
          content: messageData.content,
          userId: mockUserId,
          sessionId: mockSessionId,
        },
      });
      // AI応答の確認は同様なので省略可

      expect(result.sessionId).toBe(mockSessionId);
    });
  });

  describe('getChatHistory', () => {
    const mockMessagesFromDb: any[] = [ // 型をanyに変更
      { id: 'msg1', role: ChatRole.USER, content: 'メッセージ1', timestamp: new Date(), userId: mockUserId, sessionId: mockSessionId },
      { id: 'msg2', role: ChatRole.ASSISTANT, content: '応答1', timestamp: new Date(), userId: mockUserId, sessionId: mockSessionId },
    ];

    it('指定したセッションIDのチャット履歴が取得できること', async () => {
      (prisma.chatMessage.findMany as jest.Mock).mockResolvedValue(mockMessagesFromDb);
      const query: ChatHistoryRequest = { sessionId: mockSessionId };

      const result = await chatService.getChatHistory(mockUserId, query);

      expect(prisma.chatMessage.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, sessionId: mockSessionId },
        orderBy: { timestamp: 'asc' },
        take: 50, // default limit
      });
      expect(result.messages.length).toBe(mockMessagesFromDb.length);
      expect(result.sessionId).toBe(mockSessionId);
    });

    it('セッションIDなしでチャット履歴を取得し、履歴からセッションIDが決定されること', async () => {
      (prisma.chatMessage.findMany as jest.Mock).mockResolvedValue(mockMessagesFromDb);
      const query: ChatHistoryRequest = { limit: 10 };

      const result = await chatService.getChatHistory(mockUserId, query);

      expect(prisma.chatMessage.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { timestamp: 'asc' },
        take: 10,
      });
      expect(result.messages.length).toBe(mockMessagesFromDb.length);
      expect(result.sessionId).toBe(mockSessionId); // 履歴の最初のメッセージのsessionId
      expect(uuidv4).not.toHaveBeenCalled();
    });

    it('チャット履歴がない場合、新しいセッションIDが生成されること', async () => {
      (prisma.chatMessage.findMany as jest.Mock).mockResolvedValue([]);
      const query: ChatHistoryRequest = {};

      const result = await chatService.getChatHistory(mockUserId, query);

      expect(result.messages.length).toBe(0);
      expect(result.sessionId).toBe(fixedUuid);
      expect(uuidv4).toHaveBeenCalledTimes(1);
    });
  });
});