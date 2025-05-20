import * as authService from '../../../app/modules/auth/auth.service';
import { supabase } from '../../../app/lib/supabaseClient';
// PrismaClientはsetup.tsでモックされるため、ここでの直接インポートとモックは不要

// テスト前の準備
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Service', () => {
  describe('サインアップ', () => {
    it('ユーザー登録が成功すること', async () => {
      // モックの戻り値を設定
      // supabase.auth.signUp は setup.ts でモックされている想定
      // Prismaの処理 (例: userService.createUserProfile) も setup.ts のモックが使われる想定

      // テスト対象の関数を呼び出し
      const result = await authService.registerUser({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User'
      });

      // 結果を検証
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('既存のメールアドレスでエラーになること', async () => {
      // モックがエラーを返すように設定
      // supabase.auth.signUp は jest.SpyOn で特定のテストケース用に挙動を変えるか、
      // setup.ts のデフォルトモックが期待通りでない場合に上書きする
      jest.spyOn(supabase.auth, 'signUp').mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Email already in use', status: 400 } as any // 型エラーを避けるためにas any
      });

      // エラーがスローされることを期待
      await expect(
        authService.registerUser({
          email: 'existing@example.com',
          password: 'password123',
          displayName: 'Existing User'
        })
      ).rejects.toThrow();
    });
  });

  describe('サインイン', () => {
    it('ログインが成功すること', async () => {
      // テスト対象の関数を呼び出し
      const result = await authService.loginUser({
        email: 'test@example.com',
        password: 'password123'
      });

      // 結果を検証
      expect(result).toBeDefined();
      expect(result.session).toBeDefined();
      expect(result.user).toBeDefined();
    });
  });
});