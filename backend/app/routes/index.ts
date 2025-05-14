import { Router } from 'express';
import authRoutes from '@modules/auth/auth.routes';
import userRoutes from '@modules/users/users.routes';
import approvalInfoRoutes from '@modules/approvalInfo/approvalInfo.routes';
import chatRoutes from '@modules/chat/chat.routes';
import feedbackRoutes from '@modules/feedback/feedback.routes';
import similarCasesRoutes from '@modules/similarCases/similarCases.routes';
import returnInfoRoutes from '@modules/returnInfo/returnInfo.routes'; // 差し戻し情報ルートをインポート
import { env } from '@config/index';

const router = Router();
const apiBasePath = env.API_BASE_PATH || '/api/v1';

router.use(`${apiBasePath}/auth`, authRoutes);
router.use(`${apiBasePath}/users`, userRoutes);
router.use(`${apiBasePath}/approval-info`, approvalInfoRoutes);
router.use(`${apiBasePath}/chat`, chatRoutes);
router.use(`${apiBasePath}/feedback`, feedbackRoutes);
router.use(`${apiBasePath}/similar-cases`, similarCasesRoutes);
router.use(`${apiBasePath}/return-info`, returnInfoRoutes); // 差し戻し情報ルートを追加

router.get(`${apiBasePath}/health`, (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

export default router;