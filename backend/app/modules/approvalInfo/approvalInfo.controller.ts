import { Request, Response } from 'express';
import { ApprovalInfoService } from './approvalInfo.service';
import { ExtendedRequest } from '../../middleware/auth.middleware';
import { CreateApprovalInfoDto } from './approvalInfo.types';
import { HttpError } from '../../utils/errors';

export class ApprovalInfoController {
  private readonly approvalInfoService: ApprovalInfoService;

  constructor() {
    this.approvalInfoService = new ApprovalInfoService();
  }

  // 新しい承認情報を作成するコントローラーメソッド
  createApprovalInfo = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
      // 認証ミドルウェアを通過していれば、ユーザーIDが利用可能
      if (!req.user?.uid) {
        throw new HttpError(401, '認証されていません');
      }

      const approvalInfoData: CreateApprovalInfoDto = req.body;

      // サービスを呼び出して承認情報を作成
      const result = await this.approvalInfoService.createApprovalInfo(req.user.uid, approvalInfoData);

      // 作成成功レスポンスを返す
      res.status(201).json(result);
    } catch (error) {
      // エラーハンドリング
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('承認情報の作成エラー:', error);
        res.status(500).json({ message: 'サーバー内部エラーが発生しました。' });
      }
    }
  };

  // 他のコントローラーメソッド（取得、更新、削除）もここに追加できます
}