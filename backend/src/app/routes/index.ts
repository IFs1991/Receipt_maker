import { Router } from 'express';
import { env } from '../config';

// 各モジュールのルーターをインポート
import authRouter from '../modules/auth/auth.routes';
import usersRouter from '../modules/users/users.routes';
import chatRouter from '../modules/chat/chat.routes';
import similarCasesRouter from '../modules/similarCases/similarCases.routes';
import feedbackRouter from '../modules/feedback/feedback.routes';
import approvalInfoRouter from '../modules/approvalInfo/approvalInfo.routes';
import returnInfoRouter from '../modules/returnInfo/returnInfo.routes';

const router = Router();
const apiBasePath = env.API_BASE_PATH || '/api/v1';

// ヘルスチェックエンドポイント
router.get(`${apiBasePath}/health`, (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// 各モジュールのルーターをマウント
router.use(`${apiBasePath}/auth`, authRouter);
router.use(`${apiBasePath}/users`, usersRouter);
router.use(`${apiBasePath}/chat`, chatRouter);
router.use(`${apiBasePath}/similar-cases`, similarCasesRouter);
router.use(`${apiBasePath}/feedback`, feedbackRouter);
router.use(`${apiBasePath}/approval-info`, approvalInfoRouter);
router.use(`${apiBasePath}/return-info`, returnInfoRouter);

export default router;