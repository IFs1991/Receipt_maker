import { Router } from 'express';
import * as similarCasesController from './similarCases.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// 類似事例検索エンドポイント
router.get('/', authenticate, similarCasesController.getSimilarCases);

// 特定の類似事例取得エンドポイント
router.get('/:id', authenticate, similarCasesController.getSimilarCaseById);

// 管理者用: 類似事例作成エンドポイント
router.post('/', authenticate, similarCasesController.createSimilarCase);

// 管理者用: 類似事例更新エンドポイント
router.put('/:id', authenticate, similarCasesController.updateSimilarCase);

// 管理者用: 類似事例削除エンドポイント
router.delete('/:id', authenticate, similarCasesController.deleteSimilarCase);

export default router;