import { Request, Response, NextFunction } from 'express';
import { UpdateInjuryCauseInput } from './users.types'; // UpdateInjuryCauseInput をインポート
import * as userService from './users.service';
import { UpdateUserProfileInput } from './users.types';
import { ExtendedRequest } from '../../../middlewares/authenticate'; // ExtendedRequest型をインポート
import { HttpError } from '../../../utils/errors';

/**
 * Get current user's profile.
 */
export const getCurrentUserProfile = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.uid) {
      throw new HttpError(401, 'User not authenticated');
    }
    const userProfile = await userService.getUserProfileByFirebaseUid(req.user.uid);
    if (!userProfile) {
      throw new HttpError(404, 'User profile not found');
    }
    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user's injury cause.
 */
export const updateUserInjuryCause = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.uid) {
      throw new HttpError(401, 'User not authenticated');
    }
    const updatedInjuryCause = await userService.upsertUserInjuryCauseByFirebaseUid(
      req.user.uid,
      req.body as UpdateInjuryCauseInput // users.validator.ts で型が保証されている想定
    );
    if (!updatedInjuryCause) {
      throw new HttpError(404, 'User not found or injury cause could not be processed.');
    }
    res.status(200).json(updatedInjuryCause);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user's profile (including patient info).
 */
export const updateCurrentUserProfile = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.uid) {
      throw new HttpError(401, 'User not authenticated');
    }
    const updatedUserProfile = await userService.updateUserProfileByFirebaseUid(
      req.user.uid,
      req.body as UpdateUserProfileInput // users.validator.ts で型が保証されている想定
    );
    if (!updatedUserProfile) {
      // ユーザーが見つからず、サービス層で作成もされなかった場合 (例: 作成に必要な情報が不足)
      throw new HttpError(404, 'User profile could not be processed. It may not exist or required information for creation was missing.');
    }
    res.status(200).json(updatedUserProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user's injury cause.
 */
export const updateUserInjuryCause = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.uid) {
      throw new HttpError(401, 'User not authenticated');
    }
    const updatedInjuryCause = await userService.upsertUserInjuryCauseByFirebaseUid(
      req.user.uid,
      req.body as UpdateInjuryCauseInput // users.validator.ts で型が保証されている想定
    );
    if (!updatedInjuryCause) {
      throw new HttpError(404, 'User not found or injury cause could not be processed.');
    }
    res.status(200).json(updatedInjuryCause);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile by internal ID (example, if needed for admin or other purposes).
 */
export const getUserProfileById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const userProfile = await userService.getUserProfileById(userId);
    if (!userProfile) {
      throw new HttpError(404, 'User profile not found');
    }
    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user's injury cause.
 */
export const updateUserInjuryCause = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.uid) {
      throw new HttpError(401, 'User not authenticated');
    }
    const updatedInjuryCause = await userService.upsertUserInjuryCauseByFirebaseUid(
      req.user.uid,
      req.body as UpdateInjuryCauseInput // users.validator.ts で型が保証されている想定
    );
    if (!updatedInjuryCause) {
      throw new HttpError(404, 'User not found or injury cause could not be processed.');
    }
    res.status(200).json(updatedInjuryCause);
  } catch (error) {
    next(error);
  }
};