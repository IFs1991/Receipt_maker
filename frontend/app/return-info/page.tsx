"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { ClipboardList, Plus } from "lucide-react"
import Link from "next/link"

export default function ReturnInfo() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">返戻情報</h1>
          <p className="text-muted-foreground">
            返戻された内容と対応方法を記録・確認できます
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
              <ClipboardList className="h-5 w-5 text-primary" />
              返戻情報はまだ登録されていません
            </CardTitle>
            <CardDescription>
              「新規登録」ボタンから返戻情報を登録してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              レセプトが返戻された際の情報を登録すると、将来の申請時に参考にできます。
              返戻理由、対応策、修正ポイントなどを記録しましょう。
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
