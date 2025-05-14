import { PrismaClient } from '@prisma/client';
import { supabase, supabaseAdmin } from '../../../app/lib/supabaseClient';
import { LoginInput, RegisterInput, UserResponse, SupabaseUser } from './auth.types';
import { HttpError } from '../../../utils/errors';

const prisma = new PrismaClient();

/**
 * Maps a Prisma User object to a UserResponse object.
 */
const mapUserToResponse = (user: any): UserResponse => {
  // パスワードハッシュなどの機密情報をレスポンスから削除
  const { ...userResponse } = user;
  return userResponse;
};

/**
 * Registers a new user.
 * SupabaseのAuth機能を使用してユーザーを登録し、成功したらデータベースにも登録します。
 */
export const registerUser = async (data: RegisterInput): Promise<{ user: UserResponse, session?: any }> => {
  const { email, password, displayName } = data;

  // まずSupabaseで認証ユーザーを作成
  if (!supabaseAdmin) {
    throw new HttpError(500, 'Supabase管理者クライアントが初期化されていません');
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });

  if (authError) {
    throw new HttpError(authError.status || 500, `ユーザー登録に失敗しました: ${authError.message}`);
  }

  if (!authData.user) {
    throw new HttpError(500, 'ユーザー登録に失敗しました');
  }

  try {
    // データベースにユーザー情報を保存
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // メールアドレスが既に存在する場合（理論上はSupabaseの時点で弾かれるはず）
      throw new HttpError(409, 'このメールアドレスは既に使用されています');
    }

    const newUser = await prisma.user.create({
      data: {
        supabaseId: authData.user.id,
        email: email,
        displayName: displayName,
      },
    });

    return {
      user: mapUserToResponse(newUser),
      session: authData.session
    };
  } catch (error) {
    // データベース保存に失敗した場合、Supabaseユーザーも削除する
    if (authData.user) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    }
    throw error;
  }
};

/**
 * Logs in a user.
 * Supabaseの認証を使用してログインし、データベースからユーザー情報を取得します。
 */
export const loginUser = async (data: LoginInput): Promise<{ user: UserResponse, session: any }> => {
  const { email, password } = data;

  // Supabaseでログイン認証
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError || !authData.user) {
    throw new HttpError(401, 'メールアドレスまたはパスワードが正しくありません');
  }

  // データベースからユーザー情報を取得
  const user = await prisma.user.findUnique({
    where: { supabaseId: authData.user.id }
  });

  if (!user) {
    // Supabaseには存在するがDBにはない場合は作成
    const newUser = await prisma.user.create({
      data: {
        supabaseId: authData.user.id,
        email: authData.user.email!,
        displayName: authData.user.user_metadata?.display_name,
      },
    });
    return { user: mapUserToResponse(newUser), session: authData.session };
  }

  return { user: mapUserToResponse(user), session: authData.session };
};

/**
 * Gets a user by their Supabase UID.
 */
export const getUserBySupabaseId = async (supabaseId: string): Promise<UserResponse | null> => {
  const user = await prisma.user.findUnique({ where: { supabaseId } });
  return user ? mapUserToResponse(user) : null;
};

/**
 * Gets a user by their internal ID.
 */
export const getUserById = async (id: string): Promise<UserResponse | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? mapUserToResponse(user) : null;
};

/**
 * ログアウト処理を行います。
 */
export const logoutUser = async (accessToken: string): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new HttpError(500, `ログアウトに失敗しました: ${error.message}`);
  }
};

/**
 * 既存のSupabase認証ユーザーに基づいてシステム内のユーザーを検索または作成します。
 */
export const findOrCreateUserBySupabase = async (supabaseUser: SupabaseUser): Promise<UserResponse> => {
  let user = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id }
  });

  if (user) {
    // 既存ユーザー情報の更新（必要に応じて）
    user = await prisma.user.update({
      where: { supabaseId: supabaseUser.id },
      data: {
        email: supabaseUser.email || user.email,
        displayName: supabaseUser.user_metadata?.display_name || user.displayName,
      },
    });
    return mapUserToResponse(user);
  } else {
    // ユーザーが存在しない場合は新規作成
    const newUser = await prisma.user.create({
      data: {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email!,
        displayName: supabaseUser.user_metadata?.display_name,
      },
    });
    return mapUserToResponse(newUser);
  }
};