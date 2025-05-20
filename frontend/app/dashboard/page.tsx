"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ClipboardList, FileText, MessageSquare } from "lucide-react"

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">ダッシュボード</h1>
        <p className="text-muted-foreground">
          こんにちは、{user?.email?.split('@')[0] || 'ユーザー'}さん。レセプト理由書作成のためのサービス一覧です。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>保険申請通過情報</span>
            </CardTitle>
            <CardDescription>
              保険申請が通過した情報を登録・管理します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              保険申請の通過情報を入力し、関連する治療や処置の記録を行うことができます。
            </p>
            <Link href="/approval-info">
              <Button className="w-full">
                保険申請通過情報へ
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span>返戻情報</span>
            </CardTitle>
            <CardDescription>
              返戻された内容と対応方法を記録します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              返戻された申請の内容、返戻理由、対応策などを記録し、次回の申請に活かします。
            </p>
            <Link href="/return-info">
              <Button className="w-full">
                返戻情報へ
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>AIアシスタント</span>
            </CardTitle>
            <CardDescription>
              理由書作成をAIがサポートします
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              患者情報や症状から適切な理由書の文言をAIが提案。効率的に理由書を作成できます。
            </p>
            <Button className="w-full" disabled>
              準備中
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
