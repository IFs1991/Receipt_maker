// backend/app/modules/users/users.validator.ts
import { z } from 'zod';

// PatientInfoInput に対応するZodスキーマ
const PatientInfoInputSchema = z.object({
  name: z.string().min(1, { message: "氏名は必須です。" }).nullable().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "生年月日はYYYY-MM-DD形式である必要があります。" }).nullable().optional(), // ISO 8601 date string
  gender: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  insuranceCardNumber: z.string().nullable().optional(),
  insuranceProvider: z.string().nullable().optional(),
  policyNumber: z.string().nullable().optional(),
}).nullable().optional(),
  injuryCause: z.string().min(1, { message: "傷病原因は必須です。" }).nullable().optional(), // 傷病原因のバリデーションを追加

// UpdateUserProfileInput に対応するZodスキーマ
export const updateUserProfileSchema = z.object({
  email: z.string().email({ message: "無効なメールアドレス形式です。" }).nullable().optional(),
  username: z.string().min(1, { message: "ユーザー名は必須です。" }).nullable().optional(),
  patient: PatientInfoInputSchema,
});

// UserResponse や PatientInfoOutput は通常、レスポンスの型であり、
// Zodでのバリデーション対象は主に入力（Input）型です。
// 必要に応じてレスポンス型もZodスキーマで定義することは可能です。

export type UpdateUserProfileInputType = z.infer<typeof updateUserProfileSchema>;

// UpdateInjuryCauseInput に対応するZodスキーマ
export const updateInjuryCauseSchema = z.object({
  injuryCause: z.string().min(1, { message: "傷病原因は必須です。" }),
});

export type UpdateInjuryCauseInputType = z.infer<typeof updateInjuryCauseSchema>;