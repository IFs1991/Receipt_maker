import app from './app';
import { env } from './config';
import { logger } from './lib/logger';

const PORT = env.PORT || 3001;

// サーバーを起動
app.listen(PORT, () => {
  logger.info(`サーバーが起動しました on port ${PORT}`);
  logger.info(`API Base Path: ${env.API_BASE_PATH || '/api/v1'}`);
  logger.info(`環境: ${env.NODE_ENV || 'development'}`);
});

// 未処理のエラーハンドリング
process.on('unhandledRejection', (err) => {
  logger.error('未処理のPromise拒否:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('未捕捉の例外:', err);
  process.exit(1);
});