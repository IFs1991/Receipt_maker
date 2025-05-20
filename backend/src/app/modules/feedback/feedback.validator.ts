import { z } from 'zod';
import { FeedbackStatus, FeedbackStatusSchema } from './feedback.types';

/**
 * 拒否理由の条件付きバリデーション
 * status が 'rejected' の場合のみ拒否理由を必須にする
 */
const rejectionReasonWithStatus = (status: FeedbackStatus | undefined, rejectionReason: string | undefined) => {
  // statusが'rejected'でない場合は常に有効
  if (status !== 'rejected') return true;

  // statusが'rejected'の場合、rejectionReasonが存在し、空でないことを確認
  return !!rejectionReason && rejectionReason.trim().length > 0;
};

/**
 * フィードバック作成リクエストのZodスキーマ
 */
export const createFeedbackSchema = z.object({
  status: FeedbackStatusSchema,
  rejectionReason: z.string().optional(),
  relatedApprovalId: z.string().uuid().optional(),
}).superRefine((data, ctx) => {
  // status が 'rejected' の場合、拒否理由は必須
  if (data.status === 'rejected' && (!data.rejectionReason || data.rejectionReason.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '拒否の場合は理由を入力してください。',
      path: ['rejectionReason'],
    });
  }
});

/**
 * フィードバック更新リクエストのZodスキーマ
 */
export const updateFeedbackSchema = z.object({
  status: FeedbackStatusSchema.optional(),
  rejectionReason: z.string().optional(),
  relatedApprovalId: z.string().uuid().optional().nullable(),
}).superRefine((data, ctx) => {
  // status が 'rejected' の場合、拒否理由は必須
  if (data.status === 'rejected' && (!data.rejectionReason || data.rejectionReason.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '拒否の場合は理由を入力してください。',
      path: ['rejectionReason'],
    });
  }
});

// 型定義のエクスポート
export * from './feedback.types';