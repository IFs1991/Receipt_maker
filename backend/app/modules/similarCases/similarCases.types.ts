import { z } from 'zod';

// 類似事例検索クエリのZodスキーマ
export const SimilarCasesQuerySchema = z.object({
  symptoms: z.string().optional(),
  ageRange: z.string().regex(/^\d+-\d+$/).optional(),
  limit: z.number().int().positive().default(10).optional(),
});

export type SimilarCasesQuery = z.infer<typeof SimilarCasesQuerySchema>;

// 類似事例のモデル
export interface SimilarCaseModel {
  id: string;
  symptoms: string;
  keyPoints: string;
  approvalCategory: string;
  ageRange?: string;
  gender?: 'male' | 'female' | 'other';
  insuranceType?: string;
  createdAt: Date;
  updatedAt: Date;
}