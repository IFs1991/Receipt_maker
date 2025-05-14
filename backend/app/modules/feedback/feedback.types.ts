import { z } from 'zod';

// フィードバックのステータスを表すZodスキーマ
export const FeedbackStatusSchema = z.enum(['approved', 'rejected', 'not_submitted']);
export type FeedbackStatus = z.infer<typeof FeedbackStatusSchema>;

// フィードバック作成リクエストのZodスキーマ
export const CreateFeedbackDtoSchema = z.object({
  status: FeedbackStatusSchema,
  rejectionReason: z.string().optional(),
  relatedApprovalId: z.string().uuid().optional(),
});

export type CreateFeedbackDto = z.infer<typeof CreateFeedbackDtoSchema>;

// フィードバック更新リクエストのZodスキーマ
export const UpdateFeedbackDtoSchema = CreateFeedbackDtoSchema.partial();
export type UpdateFeedbackDto = z.infer<typeof UpdateFeedbackDtoSchema>;

// データベースから取得されるフィードバック情報の型
export interface FeedbackModel {
  id: string;
  userId: string;
  status: FeedbackStatus;
  rejectionReason: string | null;
  relatedApprovalId: string | null;
  createdAt: Date;
  updatedAt: Date;
}