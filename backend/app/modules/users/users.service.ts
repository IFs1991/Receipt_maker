import { PrismaClient, User, Patient, InjuryCause } from '@prisma/client'; // Patient, InjuryCause を追加
import { UpdateUserProfileInput, UpdateInjuryCauseInput } from './users.types';

// User と Patient の関連を含む型エイリアスを定義
type UserWithPatient = User & { patient: Patient | null };

const prisma = new PrismaClient();

/**
 * Firebase UID でユーザープロファイルを取得します。
 * ユーザーが存在しない場合は null を返します。
 */
export const getUserProfileByFirebaseUid = async (firebaseUid: string): Promise<UserWithPatient | null> => {
  return prisma.user.findUnique({
    where: { firebaseUid },
    include: { patient: true }, // patient 情報を含める
  });
};

/**
 * 内部IDでユーザープロファイルを取得します。
 * ユーザーが存在しない場合は null を返します。
 */
export const getUserProfileById = async (id: string): Promise<UserWithPatient | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: { patient: true }, // patient 情報を含める
  });
};

/**
 * 新しいユーザープロファイルを作成します。
 * 既存のユーザーがいる場合はエラーをスローするか、更新ロジックを呼び出すことを検討してください。
 * ここでは、単純に作成を試みます。
 */
export const createUserProfile = async (firebaseUid: string, data: Omit<UpdateUserProfileInput, 'patient'> & { email?: string | null, patient?: { create?: UpdateUserProfileInput['patient'] } }): Promise<UserWithPatient> => {
  // `data` から `patient` を分離し、Prisma のネストされた書き込み形式に合わせる
  const { patient, ...userData } = data;
  return prisma.user.create({
    data: {
      ...userData,
      firebaseUid,
      patient: patient ? { create: patient } : undefined,
    },
    include: { patient: true }, // patient 情報を含める
  });
};

/**
 * Firebase UID でユーザープロファイルを更新します。
 * ユーザーが存在しない場合は null を返すか、エラーをスローすることを検討してください。
 * ここでは、更新を試み、結果を返します。
 */
export const updateUserProfileByFirebaseUid = async (
  firebaseUid: string,
  data: UpdateUserProfileInput
): Promise<UserWithPatient | null> => {
  const { patient, ...userData } = data;

  // ユーザーが存在するか確認
  const existingUser = await prisma.user.findUnique({
    where: { firebaseUid },
    include: { patient: true },
  });

  if (!existingUser) {
    // ユーザーが存在しない場合、新規作成するかエラーを投げるか選択
    // ここでは例として新規作成（emailが提供されている場合）
    if (userData.email) { // emailは必須と仮定
        return prisma.user.create({
            data: {
                ...userData,
                firebaseUid,
                email: userData.email, // emailを明示的に指定
                patient: patient ? { create: patient } : undefined,
            },
            include: { patient: true }, // patient 情報を含める
        });
    } else {
        // emailがない場合はエラーまたはnullを返す
        // この例ではnullを返すが、アプリケーションの要件に応じて変更
        return null;
    }
  }

  // ユーザーが存在する場合、更新
  return prisma.user.update({
    where: { firebaseUid },
    data: {
      ...userData,
      patient: patient
        ? existingUser.patient
          ? { update: patient }
          : { create: patient }
        : undefined,
    },
    include: { patient: true }, // 更新後の患者情報も取得
  });
};

/**
 * Firebase UID でユーザーの傷病原因を作成または更新します。
 * ユーザーに紐づく最新の InjuryCause レコードを更新、なければ作成します。
 */
export const upsertUserInjuryCauseByFirebaseUid = async (
  firebaseUid: string,
  data: UpdateInjuryCauseInput
): Promise<InjuryCause | null> => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
    select: { id: true }, // ユーザーIDのみ取得
  });

  if (!user) {
    return null; // ユーザーが見つからない
  }

  // 既存の最新の傷病原因を探す (InjuryCauseモデルはuserIdがuniqueではない前提)
  const existingInjuryCause = await prisma.injuryCause.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (existingInjuryCause) {
    // 既存の傷病原因を更新
    return prisma.injuryCause.update({
      where: { id: existingInjuryCause.id },
      data: { injuryCauseText: data.injuryCause },
    });
  } else {
    // 新しい傷病原因を作成
    return prisma.injuryCause.create({
      data: {
        userId: user.id,
        injuryCauseText: data.injuryCause,
      },
    });
  }
};