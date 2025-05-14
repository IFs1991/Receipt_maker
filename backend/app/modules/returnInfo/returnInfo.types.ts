// backend/app/modules/returnInfo/returnInfo.types.ts
import { z } from 'zod';

// フロントエンドの BodyPart と同様の構造を想定
export const BodyPartSchema = z.object({
  id: z.string().uuid().optional(), // 新規作成時はundefined
  name: z.string().min(1, { message: "部位名は必須です" }),
  symptoms: z.string().min(1, { message: "症状は必須です" }),
});

export type BodyPartDto = z.infer<typeof BodyPartSchema>;

export const CreateReturnInfoDtoSchema = z.object({
  age: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : undefined),
    z.number().int().min(0, "年齢は0歳以上である必要があります").max(120, "年齢は120歳以下である必要があります").optional()
  ),
  gender: z.string().optional(),
  symptoms: z.string().min(1, { message: "主訴・症状は必須です" }),
  returnReasonText: z.string().min(1, { message: "差し戻し理由は必須です" }),
  returnType: z.string().min(1, { message: "差し戻し種別は必須です" }),
  returnDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
  initialInjuryReasonText: z.string().min(1, { message: "当初の傷病原因は必須です" }),
  injuryReasonText: z.string().min(1, { message: "変更後の傷病原因は必須です" }),
  insuranceType: z.string().min(1, { message: "保険種別は必須です" }),
  bodyParts: z.array(BodyPartSchema).optional().default([]),
});

export type CreateReturnInfoDto = z.infer<typeof CreateReturnInfoDtoSchema>;

// PrismaのReturnInfoモデルと関連するBodyPartを含む型
// Prisma Clientが生成する型を元に調整が必要な場合がある
export interface ReturnInfoWithBodyParts {
  id: string;
  userId: string;
  age: number | null;
  gender: string | null;
  symptoms: string;
  returnReasonText: string;
  returnType: string;
  returnDate: Date | null;
  initialInjuryReasonText: string;
  injuryReasonText: string;
  insuranceType: string;
  createdAt: Date;
  updatedAt: Date;
  bodyParts: BodyPartDto[]; // PrismaのBodyPart型に合わせる
}