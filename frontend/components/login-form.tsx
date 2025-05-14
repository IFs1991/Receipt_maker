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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import firebaseApp from "../lib/firebase"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("") // Changed from userId to email for Firebase
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const auth = getAuth(firebaseApp)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      const idToken = await user.getIdToken()

      // Store the ID token in LocalStorage (as per conect.yaml temporary recommendation)
      localStorage.setItem("firebaseIdToken", idToken)
      // console.log("Firebase ID Token:", idToken); // For debugging

      // Redirect to dashboard on successful login
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Firebase login error:", err)
      let errorMessage = "ログインに失敗しました。"
      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential": // Covers both wrong email and password in newer SDK versions
            errorMessage = "メールアドレスまたはパスワードが正しくありません。"
            break
          case "auth/invalid-email":
            errorMessage = "メールアドレスの形式が正しくありません。"
            break
          case "auth/too-many-requests":
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
            <Label htmlFor="email">メールアドレス</Label> {/* Changed from userId to email */}
            <Input
              id="email"
              type="email" // Changed from text to email
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
