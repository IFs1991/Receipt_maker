import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { LoginInput, RegisterInput } from './auth.types';
import { ExtendedRequest } from '../../../middlewares/authenticate'; // Assuming ExtendedRequest type for authenticated user

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    // Note: As per Firebase, ID token is usually generated on client-side after Firebase SDK signs user up.
    // Backend typically verifies this token. If backend creates user directly (e.g. via Admin SDK),
    // custom token generation or different flow might be needed.
    // For now, assuming service returns a user object and a placeholder for a token if applicable.
    res.status(201).json({ user, token }); // Adjust token handling as per actual Firebase Admin SDK usage
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const user = await authService.getUserById(req.user.uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  // For Firebase ID token based auth, logout is primarily a client-side concern (clearing the token).
  // Backend might implement token revocation if using session cookies or refresh tokens with Firebase Admin SDK.
  // For simple ID token usage, a 200 OK is often sufficient.
  try {
    // Example: If using Firebase Admin SDK to revoke refresh tokens:
    // if (req.user?.uid) {
    //   await authService.revokeToken(req.user.uid);
    // }
    res.status(200).json({ message: 'Logout successful (client should clear token)' });
  } catch (error) {
    next(error);
  }
};