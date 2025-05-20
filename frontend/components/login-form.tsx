"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import supabase from "../lib/supabase"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Supabase認証を使用してユーザーをログイン
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      // セッション情報を取得
      const { data: sessionData } = await supabase.auth.getSession()

      if (sessionData?.session) {
        // ログインが成功したらダッシュボードにリダイレクト
        router.push("/dashboard")
      } else {
        throw new Error('セッションの取得に失敗しました')
      }
    } catch (err: any) {
      console.error("Supabase login error:", err)
      let errorMessage = "ログインに失敗しました。"

      if (err.message) {
        switch (err.message) {
          case "Invalid login credentials":
            errorMessage = "メールアドレスまたはパスワードが正しくありません。"
            break
          case "Email not confirmed":
            errorMessage = "メールアドレスが確認されていません。メールを確認してください。"
            break
          case "Too many requests":
            errorMessage = "試行回数が多すぎます。後でもう一度お試しください。"
            break
          default:
            errorMessage = `エラーが発生しました: ${err.message}`
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
        <CardDescription>
          アカウント情報を入力してログインしてください
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white"
            disabled={isLoading}
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
