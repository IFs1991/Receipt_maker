// 部位の型定義
export type BodyPart = {
  id?: string
  name: string
  symptoms: string
}

// 保険種別の型定義
export type InsuranceType =
  | "national" // 国民健康保険
  | "society" // 組合管掌健康保険（組合健保）
  | "association" // 全国健康保険協会管掌健康保険（協会けんぽ）
  | "mutual" // 共済組合
  | "elderly" // 後期高齢者医療制度
  | "" // 未選択

// 差し戻し情報フォームの状態の型定義
export type ReturnInfoFormState = {
  age: string
  gender: string
  symptoms: string
  returnReason: string
  returnType: string
  returnDate: Date | undefined
  initialInjuryReason: string
  injuryReason: string
  insuranceType: InsuranceType
}

// バックエンドAPIに送信する差し戻し情報のDTO型
export type ReturnInfoSubmitDto = {
  age: string // バックエンドで数値に変換される
  gender: string
  symptoms: string
  returnReasonText: string // バックエンドのフィールド名に合わせる
  returnType: string
  returnDate: Date | undefined
  initialInjuryReasonText: string // バックエンドのフィールド名に合わせる
  injuryReasonText: string // バックエンドのフィールド名に合わせる
  insuranceType: string
  bodyParts: BodyPart[]
}

// 保険申請通過情報フォームの状態の型定義
export type ApprovalInfoFormState = {
  age: string
  gender: string
  symptoms: string
  approvalDate: Date | undefined
  isFullApproval: boolean
  partialApprovalDetails: string
  injuryReason: string
  insuranceType: InsuranceType
}

// バックエンドAPIに送信する保険申請情報のDTO型
export type ApprovalInfoSubmitDto = {
  age: string // バックエンドで数値に変換される
  gender: string
  symptoms: string
  approvalDate: Date | undefined
  isFullApproval: boolean
  partialApprovalDetails: string
  injuryReason: string
  insuranceType: string
  bodyParts: BodyPart[]
  approvedTreatments: string[]
}

// 患者情報フォームの状態の型定義
export type PatientInfoFormState = {
  age: string
  gender: string
  symptoms: string
  insuranceType: InsuranceType
}

// フォームの送信状態の型定義
export type FormStatus = "idle" | "submitting" | "success" | "error"

// バックエンドからのレスポンス型の基本型
export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

// フィードバックステータスの型定義
export type FeedbackStatus = "approved" | "rejected" | "not_submitted"

// フィードバック送信用のDTO型
export type FeedbackSubmitDto = {
  status: FeedbackStatus
  rejectionReason?: string
  relatedApprovalId?: string
}

// 類似事例の型定義
export interface SimilarCase {
  id: string
  symptoms: string
  keyPoints: string
  approvalCategory?: string
  ageRange?: string
  gender?: 'male' | 'female' | 'other'
  insuranceType?: string
  createdAt?: Date
  updatedAt?: Date
}
