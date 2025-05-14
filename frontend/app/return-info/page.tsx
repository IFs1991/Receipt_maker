import dynamic from "next/dynamic"
import DashboardLayout from "@/components/dashboard-layout"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// 動的インポートでコンポーネントを遅延ロード
const ReturnInfoForm = dynamic(() => import("@/components/return-info-form"), {
  loading: () => <FormSkeleton />,
  ssr: false,
})

// フォームのローディングスケルトン
function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
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

export default function ReturnInfoPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">差し戻し情報入力</h1>
          <Suspense fallback={<FormSkeleton />}>
            <ReturnInfoForm />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}
