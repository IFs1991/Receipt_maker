import { Response } from 'express';
import * as similarCasesService from './similarCases.service';
import { SimilarCasesQuerySchema } from './similarCases.types';
import { ExtendedRequest } from '../../middleware/auth.middleware';
import { logger } from '../../lib/logger';

// 類似事例検索
export const getSimilarCases = async (req: ExtendedRequest, res: Response) => {
  try {
    const queryParams = SimilarCasesQuerySchema.parse({
      symptoms: req.query.symptoms as string | undefined,
      ageRange: req.query.ageRange as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    });

    const similarCases = await similarCasesService.findSimilarCases(queryParams);
    return res.status(200).json(similarCases);
  } catch (error) {
    logger.error('類似事例検索エラー:', error);
    return res.status(500).json({ message: '類似事例の検索中にエラーが発生しました。' });
  }
};

// 特定の類似事例取得
export const getSimilarCaseById = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const similarCase = await similarCasesService.findSimilarCaseById(id);

    if (!similarCase) {
      return res.status(404).json({ message: '指定された類似事例が見つかりませんでした。' });
    }

    return res.status(200).json(similarCase);
  } catch (error) {
    logger.error('類似事例取得エラー:', error);
    return res.status(500).json({ message: '類似事例の取得中にエラーが発生しました。' });
  }
};

// 管理者用: 類似事例作成
export const createSimilarCase = async (req: ExtendedRequest, res: Response) => {
  try {
    // ここで管理者権限チェックを行うべき
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const caseData = req.body;

    const newCase = await similarCasesService.createSimilarCase(caseData);
    return res.status(201).json(newCase);
  } catch (error) {
    logger.error('類似事例作成エラー:', error);
    return res.status(500).json({ message: '類似事例の作成中にエラーが発生しました。' });
  }
};

// 管理者用: 類似事例更新
export const updateSimilarCase = async (req: ExtendedRequest, res: Response) => {
  try {
    // 管理者権限チェック
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const { id } = req.params;
    const updateData = req.body;

    const updatedCase = await similarCasesService.updateSimilarCase(id, updateData);

    if (!updatedCase) {
      return res.status(404).json({ message: '更新対象の類似事例が見つかりませんでした。' });
    }

    return res.status(200).json(updatedCase);
  } catch (error) {
    logger.error('類似事例更新エラー:', error);
    return res.status(500).json({ message: '類似事例の更新中にエラーが発生しました。' });
  }
};

// 管理者用: 類似事例削除
export const deleteSimilarCase = async (req: ExtendedRequest, res: Response) => {
  try {
    // 管理者権限チェック
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const { id } = req.params;
    await similarCasesService.deleteSimilarCase(id);
    return res.status(204).send();
  } catch (error) {
    logger.error('類似事例削除エラー:', error);
    return res.status(500).json({ message: '類似事例の削除中にエラーが発生しました。' });
  }
};