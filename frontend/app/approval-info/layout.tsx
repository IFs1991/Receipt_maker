"use client"

import Header from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function ApprovalInfoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuth()

  // 認証状態の読み込み中は読み込みインジケータを表示
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  )
}