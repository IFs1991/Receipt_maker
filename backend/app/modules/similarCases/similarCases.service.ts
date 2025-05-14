import { PrismaClient } from '@prisma/client';
import { SimilarCaseModel, SimilarCasesQuery } from './similarCases.types';

const prisma = new PrismaClient();

// 類似事例の検索
export const findSimilarCases = async (query: SimilarCasesQuery): Promise<SimilarCaseModel[]> => {
  const { symptoms, ageRange, limit = 10 } = query;

  const whereClause: any = {};

  if (symptoms) {
    whereClause.symptoms = {
      contains: symptoms,
      mode: 'insensitive'
    };
  }

  if (ageRange) {
    whereClause.ageRange = ageRange;
  }

  return prisma.similarCase.findMany({
    where: whereClause,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });
};

// IDによる類似事例の検索
export const findSimilarCaseById = async (id: string): Promise<SimilarCaseModel | null> => {
  return prisma.similarCase.findUnique({
    where: { id }
  });
};

// 類似事例の作成 (管理者用)
export const createSimilarCase = async (data: Omit<SimilarCaseModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<SimilarCaseModel> => {
  return prisma.similarCase.create({
    data
  });
};

// 類似事例の更新 (管理者用)
export const updateSimilarCase = async (id: string, data: Partial<Omit<SimilarCaseModel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SimilarCaseModel | null> => {
  return prisma.similarCase.update({
    where: { id },
    data
  });
};

// 類似事例の削除 (管理者用)
export const deleteSimilarCase = async (id: string): Promise<void> => {
  await prisma.similarCase.delete({
    where: { id }
  });
};