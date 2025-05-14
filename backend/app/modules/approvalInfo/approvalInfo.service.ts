import { PrismaClient } from '@prisma/client';
import { CreateApprovalInfoDto, ApprovalInfoWithBodyParts } from './approvalInfo.types';
import { HttpError } from '../../utils/errors';

export class ApprovalInfoService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 新しい承認情報を作成する
   * @param userId ユーザーID
   * @param data 承認情報データ
   * @returns 作成された承認情報
   */
  async createApprovalInfo(userId: string, data: CreateApprovalInfoDto): Promise<ApprovalInfoWithBodyParts> {
    try {
      // トランザクション内で承認情報と関連データを作成
      return await this.prisma.$transaction(async (tx) => {
        // 承認情報を作成
        const approvalInfo = await tx.approvalInfo.create({
          data: {
            userId,
            age: data.age || null,
            gender: data.gender || null,
            symptoms: data.symptoms,
            approvalDate: data.approvalDate || null,
            isFullApproval: data.isFullApproval,
            partialApprovalDetails: data.partialApprovalDetails || null,
            injuryReason: data.injuryReason,
            insuranceType: data.insuranceType,
          },
        });

        // 部位情報を作成（存在する場合）
        const bodyParts = data.bodyParts?.length
          ? await Promise.all(
              data.bodyParts.map(async (bodyPart) => {
                return tx.bodyPart.create({
                  data: {
                    approvalInfoId: approvalInfo.id,
                    name: bodyPart.name,
                    symptoms: bodyPart.symptoms,
                  },
                });
              })
            )
          : [];

        // 承認された治療を作成（存在する場合）
        const approvedTreatments = data.approvedTreatments?.length
          ? await Promise.all(
              data.approvedTreatments.map(async (treatment) => {
                return tx.approvedTreatment.create({
                  data: {
                    approvalInfoId: approvalInfo.id,
                    name: treatment,
                  },
                });
              })
            )
          : [];

        // 承認情報と関連データを含むレスポンスを返す
        return {
          ...approvalInfo,
          bodyParts: bodyParts.map((bp) => ({
            id: bp.id,
            name: bp.name,
            symptoms: bp.symptoms,
          })),
          approvedTreatments: approvedTreatments.map((t) => t.name),
        };
      });
    } catch (error) {
      console.error('承認情報作成エラー:', error);
      throw new HttpError(500, '承認情報の作成中にエラーが発生しました');
    }
  }

  // 他のサービスメソッド（取得、更新、削除）もここに追加できます。
}