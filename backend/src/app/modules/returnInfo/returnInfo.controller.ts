// backend/app/modules/returnInfo/returnInfo.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ReturnInfoService } from './returnInfo.service';
import type { CreateReturnInfoDto } from './returnInfo.types';
import type { AuthenticatedRequest } from '@/middleware/auth.middleware'; // AuthenticatedRequestをインポート

const returnInfoService = new ReturnInfoService();

export class ReturnInfoController {
  async createReturnInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ message: 'ユーザー認証が必要です。' });
      }
      const dto: CreateReturnInfoDto = req.body;
      const result = await returnInfoService.createReturnInfo(userId, dto);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating return info:', error);
      // エラーレスポンスをより具体的にする
      if (error instanceof Error && error.message.includes('unique constraint')) {
        return res.status(409).json({ message: '既に存在するデータです。', details: error.message });
      }
      next(error); // エラーハンドリングミドルウェアに委譲
    }
  }

  // 他のコントローラーメソッド（取得、更新、削除など）もここに追加できます。
  // async getReturnInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) { ... }
  // async updateReturnInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) { ... }
  // async deleteReturnInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) { ... }
}