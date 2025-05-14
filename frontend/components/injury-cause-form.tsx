"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import apiClient from "@/lib/apiClient"; // APIクライアントをインポート
import { useDebounce } from "@/lib/hooks/use-debounce"

export default function InjuryCauseForm() {
  // ローカルストレージを使用して状態を保存
  const [injuryCause, setInjuryCause, resetInjuryCause] = useLocalStorage("injury-cause", "")
  const [isLoading, setIsLoading] = useState(false) // isSaving を isLoading に変更
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 入力値をデバウンス処理
  const debouncedInjuryCause = useDebounce(injuryCause, 500)

  // 自動保存の処理は conect.yaml の指示により手動保存優先のためコメントアウトまたは削除
  // useState(() => {
  //   if (debouncedInjuryCause !== injuryCause && debouncedInjuryCause !== "") {
  //     // This logic might be removed or adapted based on API save
  //   }
  // }, [debouncedInjuryCause]);

  // 入力ハンドラー
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInjuryCause(e.target.value)
      setIsSaved(false)
    },
    [setInjuryCause],
  )

  // フォーム送信ハンドラー
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setIsSaved(false)
      setError(null)

      try {
        // conect.yaml の指示に基づき、API経由で傷病原因を送信
        // エンドポイントは仮に /users/me/injury-cause とします (バックエンド実装時に確定)
        const response = await apiClient.post("/injury-causes", { injuryCause })

        // 成功した場合
        setIsSaved(true)
        setTimeout(() => {
          setIsSaved(false)
        }, 3000)
      } catch (err: any) {
        console.error("Injury cause submission error:", err)
        let errorMessage = "保存中にエラーが発生しました。"
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message
        } else if (err.message) {
          errorMessage = err.message
        }
        setError(errorMessage)
      }
      setIsLoading(false)
    },
    [injuryCause, setInjuryCause], // setInjuryCause を依存配列に追加 (resetInjuryCauseのため)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>傷病原因</CardTitle>
        <CardDescription>傷病の原因や経緯について詳しく記入してください</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="injuryCause">傷病原因の詳細</Label>
            <Textarea
              id="injuryCause"
              value={injuryCause}
              onChange={handleChange}
              placeholder="例: 2週間前から徐々に腰痛が悪化し、右足にしびれが出現。座っている時間が長いと症状が悪化する。"
              rows={5}
              className="resize-y transition-all duration-100"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="bg-[#4285f4] hover:bg-[#3367d6] transition-all duration-150"
              disabled={isLoading}
            >
              {isLoading ? "保存中..." : "保存"}
            </Button>
            {isSaved && <div className="ml-4 text-green-600 animate-in fade-in duration-300">保存しました</div>}
            {error && <div className="ml-4 text-red-600 animate-in fade-in duration-300">{error}</div>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
