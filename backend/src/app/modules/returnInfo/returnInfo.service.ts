// backend/app/modules/returnInfo/returnInfo.service.ts
import { PrismaClient } from '@prisma/client';
import type { CreateReturnInfoDto, ReturnInfoWithBodyParts, BodyPartDto } from './returnInfo.types';

const prisma = new PrismaClient();

export class ReturnInfoService {
  async createReturnInfo(userId: string, data: CreateReturnInfoDto): Promise<ReturnInfoWithBodyParts> {
    const { bodyParts, ...returnData } = data;

    const createdReturnInfo = await prisma.returnInfo.create({
      data: {
        ...returnData,
        userId,
        // PrismaがDate型を期待するため、undefinedの場合はnullを設定するか、
        // スキーマで必須にするか、型定義で Date | null にするなどの調整が必要
        returnDate: data.returnDate ? new Date(data.returnDate) : null,
        bodyParts: bodyParts && bodyParts.length > 0
          ? {
              create: bodyParts.map((part: BodyPartDto) => ({
                name: part.name,
                symptoms: part.symptoms,
              })),
            }
          : undefined,
      },
      include: {
        bodyParts: true, // 作成後にbodyPartsを含めて返す
      },
    });

    // Prismaの戻り値の型とReturnInfoWithBodyPartsの型を合わせる
    // bodyPartsの型が異なる可能性があるため、適切にマッピングする
    return {
      ...createdReturnInfo,
      age: createdReturnInfo.age, // Prismaの型が number | null の場合があるため合わせる
      gender: createdReturnInfo.gender, // 同上
      returnDate: createdReturnInfo.returnDate, // 同上
      bodyParts: createdReturnInfo.bodyParts.map(bp => ({
        id: bp.id,
        name: bp.name,
        symptoms: bp.symptoms
      })),
    };
  }

  // 他のメソッド（取得、更新、削除など）もここに追加できます。
  // async getReturnInfoById(id: string): Promise<ReturnInfoWithBodyParts | null> { ... }
  // async updateReturnInfo(id: string, data: Partial<CreateReturnInfoDto>): Promise<ReturnInfoWithBodyParts | null> { ... }
  // async deleteReturnInfo(id: string): Promise<void> { ... }
}