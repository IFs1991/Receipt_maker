import { Router } from 'express';
// import { env } from '../config'; // env is not needed here anymore

// 各モジュールのルーターをインポート
import authRouter from '../modules/auth/auth.routes';
import usersRouter from '../modules/users/users.routes';
import chatRouter from '../modules/chat/chat.routes';
import similarCasesRouter from '../modules/similarCases/similarCases.routes';
import feedbackRouter from '../modules/feedback/feedback.routes';
import approvalInfoRouter from '../modules/approvalInfo/approvalInfo.routes';
import returnInfoRouter from '../modules/returnInfo/returnInfo.routes';

const router = Router();
// const apiBasePath = env.API_BASE_PATH || '/api/v1'; // Removed, as base path is applied in app.ts

// ヘルスチェックエンドポイント (ルートパス直下に変更)
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// 各モジュールのルーターをマウント (ベースパスなしで)
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/chat', chatRouter);
router.use('/similar-cases', similarCasesRouter);
router.use('/feedback', feedbackRouter);
router.use('/approval-info', approvalInfoRouter);
router.use('/return-info', returnInfoRouter);

export default router;