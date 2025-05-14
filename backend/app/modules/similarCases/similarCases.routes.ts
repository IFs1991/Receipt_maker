import { Router } from 'express';
import * as similarCasesController from './similarCases.controller';
import { authenticateUser } from '../../middleware/auth.middleware';

const router = Router();

// 類似事例検索エンドポイント
router.get('/', authenticateUser, similarCasesController.getSimilarCases);

// 特定の類似事例取得エンドポイント
router.get('/:id', authenticateUser, similarCasesController.getSimilarCaseById);

// 管理者用: 類似事例作成エンドポイント
router.post('/', authenticateUser, similarCasesController.createSimilarCase);

// 管理者用: 類似事例更新エンドポイント
router.put('/:id', authenticateUser, similarCasesController.updateSimilarCase);

// 管理者用: 類似事例削除エンドポイント
router.delete('/:id', authenticateUser, similarCasesController.deleteSimilarCase);

export default router;