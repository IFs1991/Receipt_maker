import { Router } from 'express';
import { ApprovalInfoController } from './approvalInfo.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateCreateApprovalInfo } from './approvalInfo.validator';

const router = Router();
const approvalInfoController = new ApprovalInfoController();

// POST /api/v1/approval-info - 新しい承認情報を作成 (認証が必要)
router.post(
  '/',
  authenticate,
  validateCreateApprovalInfo,
  approvalInfoController.createApprovalInfo
);

// 他のルート（取得、更新、削除など）もここに追加できます。
// router.get('/:id', authenticate, approvalInfoController.getApprovalInfo);
// router.put('/:id', authenticate, validateUpdateApprovalInfo, approvalInfoController.updateApprovalInfo);
// router.delete('/:id', authenticate, approvalInfoController.deleteApprovalInfo);

export default router;