import * as userService from '../../../app/modules/users/users.service';
import prisma from '../../../app/database'; // setup.ts でモックされる Prisma Client
import { HttpError } from '../../../utils/errors';

// jest.mockはsetup.tsで行われている想定

const mockUserWithPatient = {
  id: 'user-id-1',
  firebaseUid: 'firebase-uid-1',  // このフィールドはまだ使用中
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  patient: {  // このリレーションはまだ使用中
    id: 'patient-id-1',
    userId: 'user-id-1',
    registrationDate: new Date(),
    lastVisitDate: new Date(),
    medicalHistory: null,
    medications: null,
    allergies: null,
    symptoms: 'symptom text',
    assessment: 'assessment text',
    treatmentPlan: 'plan text',
    referralStatus: 'NoReferral',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockInjuryCause = {
  id: 'injury-cause-id-1',
  userId: 'user-id-1',
  injuryCauseText: 'Test injury cause',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // getUserProfileByFirebaseUid
  describe('getUserProfileByFirebaseUid', () => {
    it('Firebase UIDでユーザーが見つかる場合、ユーザー情報を返す', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserWithPatient);
      const user = await userService.getUserProfileByFirebaseUid('firebase-uid-1');
      expect(user).toEqual(mockUserWithPatient);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { firebaseUid: 'firebase-uid-1' },
        include: { patient: true },
      });
    });

    it('Firebase UIDでユーザーが見つからない場合、HttpError(404)をスローする', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(userService.getUserProfileByFirebaseUid('unknown-uid')).rejects.toThrow(
        new HttpError(404, 'ユーザーが見つかりません')
      );
    });
  });

  // getUserProfileById
  describe('getUserProfileById', () => {
    it('IDでユーザーが見つかる場合、ユーザー情報を返す', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserWithPatient);
      const user = await userService.getUserProfileById('user-id-1');
      expect(user).toEqual(mockUserWithPatient);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
        include: { patient: true },
      });
    });

    it('IDでユーザーが見つからない場合、HttpError(404)をスローする', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(userService.getUserProfileById('unknown-id')).rejects.toThrow(
        new HttpError(404, 'ユーザーが見つかりません')
      );
    });
  });

  // createUserProfile
  describe('createUserProfile', () => {
    it('新しいユーザープロファイルが作成されること', async () => {
      const input = { email: 'new@example.com', displayName: 'New User' };
      const expectedOutput = { ...mockUserWithPatient, ...input, firebaseUid: 'new-firebase-uid' };
      (prisma.user.create as jest.Mock).mockResolvedValue(expectedOutput);

      const user = await userService.createUserProfile('new-firebase-uid', input);
      expect(user).toEqual(expectedOutput);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...input, firebaseUid: 'new-firebase-uid', patient: undefined },
        include: { patient: true },
      });
    });
  });

  // updateUserProfileByFirebaseUid
  describe('updateUserProfileByFirebaseUid', () => {
    it('既存ユーザーのプロファイルが更新されること', async () => {
      const updateData = { displayName: 'Updated User Name' };
      const updatedUser = { ...mockUserWithPatient, ...updateData };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserWithPatient); // findUnique for existing user check
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const user = await userService.updateUserProfileByFirebaseUid('firebase-uid-1', updateData);
      expect(user).toEqual(updatedUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { firebaseUid: 'firebase-uid-1' }, include: { patient: true } });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { firebaseUid: 'firebase-uid-1' },
        data: { ...updateData, patient: undefined }, // patientの更新ロジックは複雑なので別途テスト推奨
        include: { patient: true },
      });
    });

    it('更新対象のユーザーが見つからない場合、HttpError(404)をスローする', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(userService.updateUserProfileByFirebaseUid('unknown-uid', {})).rejects.toThrow(
        new HttpError(404, 'ユーザーが見つかりません')
      );
    });
  });

  // upsertUserInjuryCauseByFirebaseUid
  describe('upsertUserInjuryCauseByFirebaseUid', () => {
    const injuryData = { injuryCause: 'Updated injury cause' };

    it('ユーザーが見つからない場合、HttpError(404)をスローする', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(userService.upsertUserInjuryCauseByFirebaseUid('unknown-uid', injuryData)).rejects.toThrow(
        new HttpError(404, 'ユーザーが見つかりません')
      );
    });

    it('既存の傷病原因がない場合、新しく作成されること', async () => {
      const createdInjuryCause = { ...mockInjuryCause, injuryCauseText: injuryData.injuryCause };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-id-1' });
      (prisma.injuryCause.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.injuryCause.create as jest.Mock).mockResolvedValue(createdInjuryCause);

      const result = await userService.upsertUserInjuryCauseByFirebaseUid('firebase-uid-1', injuryData);
      expect(result).toEqual(createdInjuryCause);
      expect(prisma.injuryCause.create).toHaveBeenCalledWith({
        data: { userId: 'user-id-1', injuryCauseText: injuryData.injuryCause },
      });
    });

    it('既存の傷病原因がある場合、それが更新されること', async () => {
      const updatedInjuryCause = { ...mockInjuryCause, injuryCauseText: injuryData.injuryCause };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-id-1' });
      (prisma.injuryCause.findFirst as jest.Mock).mockResolvedValue(mockInjuryCause);
      (prisma.injuryCause.update as jest.Mock).mockResolvedValue(updatedInjuryCause);

      const result = await userService.upsertUserInjuryCauseByFirebaseUid('firebase-uid-1', injuryData);
      expect(result).toEqual(updatedInjuryCause);
      expect(prisma.injuryCause.update).toHaveBeenCalledWith({
        where: { id: mockInjuryCause.id },
        data: { injuryCauseText: injuryData.injuryCause },
      });
    });
  });
});