import supertest from 'supertest';
import app from '../../app/app';
import { v4 as uuidv4 } from 'uuid';

const request = supertest(app);

// テスト前の準備
beforeEach(() => {
  jest.clearAllMocks();
});

describe('認証エンドポイントのE2Eテスト', () => {
  describe('POST /api/v1/auth/register', () => {
    it('新規ユーザー登録が成功すること', async () => {
      const email = `test-${uuidv4()}@example.com`;

      const response = await request
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'Password123!',
          displayName: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', email);
    });

    it('必要なフィールドがない場合にエラーが返ること', async () => {
      const response = await request
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com'
          // パスワードとディスプレイネームが欠けている
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('ログインが成功すること', async () => {
      // 事前にユーザーを登録
      const email = `login-test-${uuidv4()}@example.com`;
      const password = 'Password123!';

      await request
        .post('/api/v1/auth/register')
        .send({
          email,
          password,
          displayName: 'Login Test User'
        });

      // ログインテスト
      const loginResponse = await request
        .post('/api/v1/auth/login')
        .send({
          email,
          password
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('user');
      expect(loginResponse.body).toHaveProperty('session');
    });

    it('不正な認証情報でエラーが返ること', async () => {
      const response = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
});