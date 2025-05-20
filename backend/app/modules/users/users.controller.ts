import { Request, Response, NextFunction } from 'express';
import { UpdateInjuryCauseInput } from './users.types'; // UpdateInjuryCauseInput をインポート
import * as userService from './users.service';
import { UpdateUserProfileInput } from './users.types';
import { ExtendedRequest } from '../../middleware/auth.middleware'; // ExtendedRequest型のパスを修正
import { HttpError, NotFoundError } from '../../../utils/errors'; // NotFoundErrorをインポート

/**
 * Get current user's profile.
 */
export const getCurrentUserProfile = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    throw new HttpError(401, 'User not authenticated');
  }
  const userProfile = await userService.getUserProfileByFirebaseUid(req.user.id);
  if (!userProfile) {
    throw new NotFoundError('User profile'); // HttpError(404, 'User profile not found') から変更
  }
  res.status(200).json(userProfile);
};

/**
 * Update current user's injury cause.
 */
export const updateUserInjuryCause = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    throw new HttpError(401, 'User not authenticated');
  }
  const updatedInjuryCause = await userService.upsertUserInjuryCauseByFirebaseUid(
    req.user.id,
    req.body as UpdateInjuryCauseInput
  );
  if (!updatedInjuryCause) {
    // サービス層で適切にエラーがスローされることを期待するか、ここで具体的なエラーを投げる
    // 例: throw new HttpError(404, 'User not found or injury cause could not be processed.');
    // 今回はサービス層でエラー処理されることを前提とし、ここではチェックを簡略化または削除も検討
    // ただし、upsertの性質上、見つからなければ作成されるはずなので、この分岐に入るケースは限定的か
    throw new HttpError(404, 'User not found or injury cause could not be processed.');
  }
  res.status(200).json(updatedInjuryCause);
};

/**
 * Update current user's profile (including patient info).
 */
export const updateCurrentUserProfile = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    throw new HttpError(401, 'User not authenticated');
  }
  const updatedUserProfile = await userService.updateUserProfileByFirebaseUid(
    req.user.id,
    req.body as UpdateUserProfileInput
  );
  if (!updatedUserProfile) {
    throw new HttpError(404, 'User profile could not be processed. It may not exist or required information for creation was missing.');
  }
  res.status(200).json(updatedUserProfile);
};

/**
 * Get user profile by internal ID (example, if needed for admin or other purposes).
 */
export const getUserProfileById = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const userProfile = await userService.getUserProfileById(userId);
  if (!userProfile) {
    throw new NotFoundError('User profile'); // HttpError(404, 'User profile not found') から変更
  }
  res.status(200).json(userProfile);
};