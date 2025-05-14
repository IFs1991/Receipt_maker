// backend/app/modules/returnInfo/returnInfo.routes.ts
import { Router } from 'express';
import { ReturnInfoController } from './returnInfo.controller';
import { validateCreateReturnInfo } from './returnInfo.validator';
import { authenticate } from '@/middleware/auth.middleware'; // 認証ミドルウェアをインポート

const router = Router();
const returnInfoController = new ReturnInfoController();

// POST /api/v1/return-info - 新しい差し戻し情報を作成 (認証が必要)
router.post(
  '/',
  authenticate, // 認証ミドルウェアを追加
  validateCreateReturnInfo,
  returnInfoController.createReturnInfo
);

// 他のルート（取得、更新、削除など）もここに追加できます。
// router.get('/:id', authenticate, returnInfoController.getReturnInfo);
// router.put('/:id', authenticate, validateUpdateReturnInfo, returnInfoController.updateReturnInfo);
// router.delete('/:id', authenticate, returnInfoController.deleteReturnInfo);

export default router;