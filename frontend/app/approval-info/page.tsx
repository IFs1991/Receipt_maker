"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"

export default function ApprovalInfo() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">保険申請通過情報</h1>
          <p className="text-muted-foreground">
            保険申請が通過した情報を登録・確認できます
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新規登録
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              保険申請通過情報はまだ登録されていません
            </CardTitle>
            <CardDescription>
              「新規登録」ボタンから保険申請通過情報を登録してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              保険申請の通過情報を登録すると、理由書作成時に参照できるようになります。
              患者の基本情報、傷病内容、承認された治療内容などを記録しましょう。
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Link href="/dashboard">
          <Button variant="outline">ダッシュボードに戻る</Button>
        </Link>
      </div>
    </div>
  )
}
