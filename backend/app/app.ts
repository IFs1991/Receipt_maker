import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger';

import { env } from './config';
import mainRouter from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { logger } from './lib/logger';

const app: Express = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

app.use(env.API_BASE_PATH, mainRouter);

if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info(`Swagger Docs available at http://localhost:${env.PORT || 3001}${env.API_BASE_PATH}/api-docs`);
}

app.get('/', (req: Request, res: Response) => {
  res.send('Receipt Reason Assistant Backend is running!');
});

app.use(errorHandler);

export default app;