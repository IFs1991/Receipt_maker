import { Response } from 'express';
import * as feedbackService from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './feedback.types';
import { ExtendedRequest } from '../../middleware/auth.middleware';
import { logger } from '../../lib/logger';

// フィードバック作成
export const createFeedback = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?.id; // 認証ミドルウェアからユーザーIDを取得
    if (!userId) {
      return res.status(401).json({ message: '認証されていないユーザーです。' });
    }

    const feedbackData: CreateFeedbackDto = req.body;
    const feedback = await feedbackService.createFeedback(userId, feedbackData);

    return res.status(201).json(feedback);
  } catch (error) {
    logger.error('フィードバック作成エラー:', error);
    return res.status(500).json({ message: 'フィードバック作成中にエラーが発生しました。' });
  }
};

// フィードバック一覧取得
export const getFeedbacks = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '認証されていないユーザーです。' });
    }

    const feedbacks = await feedbackService.getFeedbacksByUserId(userId);
    return res.status(200).json(feedbacks);
  } catch (error) {
    logger.error('フィードバック取得エラー:', error);
    return res.status(500).json({ message: 'フィードバック取得中にエラーが発生しました。' });
  }
};

// 特定のフィードバック取得
export const getFeedbackById = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '認証されていないユーザーです。' });
    }

    const feedback = await feedbackService.getFeedbackById(id);

    if (!feedback) {
      return res.status(404).json({ message: 'フィードバックが見つかりませんでした。' });
    }

    if (feedback.userId !== userId) {
      return res.status(403).json({ message: 'このフィードバックにアクセスする権限がありません。' });
    }

    return res.status(200).json(feedback);
  } catch (error) {
    logger.error('フィードバック取得エラー:', error);
    return res.status(500).json({ message: 'フィードバック取得中にエラーが発生しました。' });
  }
};

// フィードバック更新
export const updateFeedback = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '認証されていないユーザーです。' });
    }

    // 既存のフィードバックを確認
    const existingFeedback = await feedbackService.getFeedbackById(id);

    if (!existingFeedback) {
      return res.status(404).json({ message: 'フィードバックが見つかりませんでした。' });
    }

    if (existingFeedback.userId !== userId) {
      return res.status(403).json({ message: 'このフィードバックを更新する権限がありません。' });
    }

    const updateData: UpdateFeedbackDto = req.body;
    const updatedFeedback = await feedbackService.updateFeedback(id, updateData);

    return res.status(200).json(updatedFeedback);
  } catch (error) {
    logger.error('フィードバック更新エラー:', error);
    return res.status(500).json({ message: 'フィードバック更新中にエラーが発生しました。' });
  }
};

// フィードバック削除
export const deleteFeedback = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '認証されていないユーザーです。' });
    }

    // 既存のフィードバックを確認
    const existingFeedback = await feedbackService.getFeedbackById(id);

    if (!existingFeedback) {
      return res.status(404).json({ message: 'フィードバックが見つかりませんでした。' });
    }

    if (existingFeedback.userId !== userId) {
      return res.status(403).json({ message: 'このフィードバックを削除する権限がありません。' });
    }

    await feedbackService.deleteFeedback(id);

    return res.status(204).send();
  } catch (error) {
    logger.error('フィードバック削除エラー:', error);
    return res.status(500).json({ message: 'フィードバック削除中にエラーが発生しました。' });
  }
};