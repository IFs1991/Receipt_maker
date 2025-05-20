import { PrismaClient } from '@prisma/client';
import { env } from '@config/index';

const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export default prisma;