import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import mainRouter from '@routes/index';
import { errorHandler } from '@middleware/errorHandler.middleware';
import { env } from '@config/index';
import { logger } from '@lib/logger';

const app: Express = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

app.use(mainRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Receipt Reason Assistant Backend is running!');
});

app.use(errorHandler);

export default app;