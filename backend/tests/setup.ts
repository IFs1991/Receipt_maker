jest.mock('firebase-admin', () => {
  const actualFirebaseAdmin = jest.requireActual('firebase-admin');
  return {
    ...actualFirebaseAdmin,
    initializeApp: jest.fn(),
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@example.com' }),
      createUser: jest.fn().mockResolvedValue({ uid: 'new-uid', email: 'new@example.com' }),
      getUserByEmail: jest.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@example.com' }),
      generatePasswordResetLink: jest.fn().mockResolvedValue('mock-reset-link'),
      revokeRefreshTokens: jest.fn().mockResolvedValue(undefined),
    })),
  };
});