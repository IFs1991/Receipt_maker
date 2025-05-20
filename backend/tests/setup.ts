// Firebase Adminのモックを無効化し、Supabase SDKをモック化
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'test-supabase-id',
              email: 'test@example.com',
              app_metadata: {},
              user_metadata: {}
            }
          },
          error: null
        }),
        signUp: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'new-supabase-id',
              email: 'new@example.com'
            },
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token'
            }
          },
          error: null
        }),
        signIn: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'test-supabase-id',
              email: 'test@example.com'
            },
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token'
            }
          },
          error: null
        }),
        signOut: jest.fn().mockResolvedValue({ error: null })
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: {}, error: null }),
            maybeSingle: jest.fn().mockResolvedValue({ data: {}, error: null }),
            execute: jest.fn().mockResolvedValue({ data: [], error: null })
          }))
        })),
        insert: jest.fn(() => ({
          execute: jest.fn().mockResolvedValue({ data: {}, error: null })
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            execute: jest.fn().mockResolvedValue({ data: {}, error: null })
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            execute: jest.fn().mockResolvedValue({ data: {}, error: null })
          }))
        }))
      }))
    }))
  };
});

// Prismaモック（スキーマに合わせて更新）
jest.mock('@prisma/client', () => {
  // 型定義をエクスポート
  const models = {
    // ユーザーモデル
    User: jest.fn().mockImplementation((data) => data),
    PatientInfo: jest.fn().mockImplementation((data) => data),
    InjuryCause: jest.fn().mockImplementation((data) => data),
    ReturnInfo: jest.fn().mockImplementation((data) => data),
    ApprovalInfo: jest.fn().mockImplementation((data) => data),
    BodyPart: jest.fn().mockImplementation((data) => data),
    ChatSession: jest.fn().mockImplementation((data) => data),
    ChatMessage: jest.fn().mockImplementation((data) => data),
    Feedback: jest.fn().mockImplementation((data) => data),
  };

  return {
    ...models,
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
        upsert: jest.fn().mockResolvedValue({})
      },
      patientInfo: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
        upsert: jest.fn().mockResolvedValue({})
      },
      injuryCause: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
        upsert: jest.fn().mockResolvedValue({})
      },
      returnInfo: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({})
      },
      approvalInfo: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({})
      },
      bodyPart: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({})
      },
      chatSession: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({})
      },
      chatMessage: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({})
      },
      feedback: {
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({})
      },
      $connect: jest.fn(),
      $disconnect: jest.fn()
    }))
  };
});