import { Request, Response, NextFunction } from 'express';
import * as chatService from './chat.service';
import { ExtendedRequest } from '../../middleware/auth.middleware';
import { ChatHistoryRequest, SendMessageRequest } from './chat.types';
import { logger } from '../../lib/logger';
import { HttpError } from '../../../utils/errors';

/**
 * 新しいメッセージを送信する
 */
export const sendMessage = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new HttpError(401, '認証が必要です');
  }

  const messageData: SendMessageRequest = req.body;
  const result = await chatService.processMessage(userId, messageData);

  res.status(200).json(result);
};

/**
 * チャット履歴を取得する
 */
export const getChatHistory = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new HttpError(401, '認証が必要です');
  }

  const query: ChatHistoryRequest = {
    sessionId: req.query.sessionId as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
  };

  const history = await chatService.getChatHistory(userId, query);

  res.status(200).json(history);
};