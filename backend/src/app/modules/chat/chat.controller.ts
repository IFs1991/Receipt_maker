import { Request, Response } from 'express';
import * as chatService from './chat.service';
import { ExtendedRequest } from '../../middleware/auth.middleware';
import { ChatHistoryRequest, SendMessageRequest } from './chat.types';
import { logger } from '../../lib/logger';

/**
 * 新しいメッセージを送信する
 */
export const sendMessage = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const messageData: SendMessageRequest = req.body;
    const result = await chatService.processMessage(userId, messageData);

    return res.status(200).json(result);
  } catch (error) {
    logger.error('メッセージ送信エラー:', error);
    return res.status(500).json({ message: 'メッセージ処理中にエラーが発生しました' });
  }
};

/**
 * チャット履歴を取得する
 */
export const getChatHistory = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const query: ChatHistoryRequest = {
      sessionId: req.query.sessionId as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    };

    const history = await chatService.getChatHistory(userId, query);

    return res.status(200).json(history);
  } catch (error) {
    logger.error('チャット履歴取得エラー:', error);
    return res.status(500).json({ message: 'チャット履歴の取得中にエラーが発生しました' });
  }
};