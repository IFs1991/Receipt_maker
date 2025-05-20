import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { LoginUserDto, RegisterUserDto } from './auth.types';
import { ExtendedRequest } from '../../middleware/auth.middleware';
import { HttpError, NotFoundError } from '../../../utils/errors';
import * as userService from '../users/users.service';

export const register = async (req: Request<{}, {}, RegisterUserDto>, res: Response, next: NextFunction) => {
  const authResponse = await authService.registerUser(req.body);
  res.status(201).json(authResponse);
};

export const login = async (req: Request<{}, {}, LoginUserDto>, res: Response, next: NextFunction) => {
  const authResponse = await authService.loginUser(req.body);
  res.status(200).json(authResponse);
};

export const getMe = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    throw new HttpError(401, 'User not authenticated');
  }
  const userProfile = await userService.getUserProfileByFirebaseUid(req.user.id);
  if (!userProfile) {
    throw new NotFoundError('User profile');
  }
  res.status(200).json(userProfile);
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        // Potentially call a service to blacklist the token if using a blacklist strategy
        // await authService.logoutUser(token); // Assuming logoutUser takes the token
    }
  }
  res.status(200).json({ message: 'Logout successful (client should clear token)' });
};