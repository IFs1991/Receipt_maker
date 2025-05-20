import { PrismaClient } from '@prisma/client';
import { CreateFeedbackDto, FeedbackModel, UpdateFeedbackDto } from './feedback.types';

const prisma = new PrismaClient();

// フィードバック作成
export const createFeedback = async (userId: string, data: CreateFeedbackDto): Promise<FeedbackModel> => {
  return prisma.feedback.create({
    data: {
      userId,
      status: data.status,
      rejectionReason: data.status === 'rejected' ? data.rejectionReason : null,
      relatedApprovalId: data.relatedApprovalId || null,
    },
  });
};

// ユーザーIDによるフィードバック一覧取得
export const getFeedbacksByUserId = async (userId: string): Promise<FeedbackModel[]> => {
  return prisma.feedback.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

// IDによるフィードバック取得
export const getFeedbackById = async (id: string): Promise<FeedbackModel | null> => {
  return prisma.feedback.findUnique({
    where: { id },
  });
};

// フィードバック更新
export const updateFeedback = async (id: string, data: UpdateFeedbackDto): Promise<FeedbackModel> => {
  return prisma.feedback.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.status === 'rejected'
        ? { rejectionReason: data.rejectionReason }
        : data.status && { rejectionReason: null }),
      ...(data.relatedApprovalId !== undefined && { relatedApprovalId: data.relatedApprovalId }),
    },
  });
};

// フィードバック削除
export const deleteFeedback = async (id: string): Promise<void> => {
  await prisma.feedback.delete({
    where: { id },
  });
};