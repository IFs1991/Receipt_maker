import { z } from 'zod';

// フロントエンドの BodyPart と同様の構造を想定
export const BodyPartSchema = z.object({
  id: z.string().uuid().optional(), // 新規作成時はundefined
  name: z.string().min(1, { message: "部位名は必須です" }),
  symptoms: z.string().min(1, { message: "症状は必須です" }),
});

export type BodyPartDto = z.infer<typeof BodyPartSchema>;

export const CreateApprovalInfoDtoSchema = z.object({
  age: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : undefined),
    z.number().int().min(0, "年齢は0歳以上である必要があります").max(120, "年齢は120歳以下である必要があります").optional()
  ),
  gender: z.string().optional(),
  symptoms: z.string().min(1, { message: "主訴・症状は必須です" }),
  approvalDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
  isFullApproval: z.boolean().default(true),
  partialApprovalDetails: z.string().optional(),
  injuryReason: z.string().min(1, { message: "受傷理由は必須です" }),
  insuranceType: z.string().min(1, { message: "保険種別は必須です" }),
  bodyParts: z.array(BodyPartSchema).optional().default([]),
  approvedTreatments: z.array(z.string()).optional().default([]),
});

export type CreateApprovalInfoDto = z.infer<typeof CreateApprovalInfoDtoSchema>;

// PrismaのApprovalInfoモデルと関連するBodyPartを含む型
// Prisma Clientが生成する型を元に調整が必要な場合がある
export interface ApprovalInfoWithBodyParts {
  id: string;
  userId: string;
  age: number | null;
  gender: string | null;
  symptoms: string;
  approvalDate: Date | null;
  isFullApproval: boolean;
  partialApprovalDetails: string | null;
  injuryReason: string;
  insuranceType: string;
  createdAt: Date;
  updatedAt: Date;
  bodyParts: BodyPartDto[]; // PrismaのBodyPart型に合わせる
  approvedTreatments: string[]; // 承認された治療のリスト
}