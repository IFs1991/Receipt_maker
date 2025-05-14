import dynamic from "next/dynamic"
import DashboardLayout from "@/components/dashboard-layout"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// 動的インポートでコンポーネントを遅延ロード
const PatientInfoForm = dynamic(() => import("@/components/patient-info-form"), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const InjuryCauseForm = dynamic(() => import("@/components/injury-cause-form"), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const ChatInterface = dynamic(() => import("@/components/chat-interface"), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const ReasonDisplay = dynamic(() => import("@/components/reason-display"), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const FeedbackInterface = dynamic(() => import("@/components/feedback-interface"), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

const SimilarCasesDisplay = dynamic(() => import("@/components/similar-cases-display"), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

// 各コンポーネントのローディングスケルトン
function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full">
        {/* 左ペイン - 入力・インタラクションエリア */}
        <div className="w-full md:w-1/2 p-4 overflow-y-auto border-r">
          <div className="space-y-6">
            <Suspense fallback={<FormSkeleton />}>
              <PatientInfoForm />
            </Suspense>
            <Suspense fallback={<FormSkeleton />}>
              <InjuryCauseForm />
            </Suspense>
            <Suspense fallback={<FormSkeleton />}>
              <ChatInterface />
            </Suspense>
          </div>
        </div>

        {/* 右ペイン - 出力・アクションエリア */}
        <div className="w-full md:w-1/2 p-4 overflow-y-auto">
          <div className="space-y-6">
            <Suspense fallback={<FormSkeleton />}>
              <ReasonDisplay />
            </Suspense>
            <Suspense fallback={<FormSkeleton />}>
              <FeedbackInterface />
            </Suspense>
            <Suspense fallback={<FormSkeleton />}>
              <SimilarCasesDisplay />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
