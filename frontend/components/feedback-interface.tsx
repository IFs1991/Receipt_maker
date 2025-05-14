"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { FeedbackStatus, FeedbackSubmitDto } from "@/types/form-types"

export default function FeedbackInterface() {
  const [status, setStatus] = useState<FeedbackStatus>("not_submitted")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status === "rejected" && !rejectionReason.trim()) {
      alert("却下理由を入力してください")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const payload: FeedbackSubmitDto = {
        status,
        rejectionReason: status === "rejected" ? rejectionReason : undefined,
      }

      const response = await apiClient.post<{ id: string; status: string }>("/feedback", payload)

      setSubmitSuccess(true)

      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (err: any) {
      console.error("フィードバック送信エラー:", err)

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("フィードバック送信中にエラーが発生しました")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>申請結果フィードバック</CardTitle>
        <CardDescription>理由書の申請結果を入力してください</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">フィードバックが正常に送信されました。</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={status === "approved" ? "default" : "outline"}
              className={status === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={() => setStatus("approved")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              承認
            </Button>
            <Button
              type="button"
              variant={status === "rejected" ? "default" : "outline"}
              className={status === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
              onClick={() => setStatus("rejected")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              却下
            </Button>
            <Button
              type="button"
              variant={status === "not_submitted" ? "default" : "outline"}
              className={status === "not_submitted" ? "bg-gray-600 hover:bg-gray-700" : ""}
              onClick={() => setStatus("not_submitted")}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              未申請
            </Button>
          </div>

          {status === "rejected" && (
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">却下理由</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="却下された理由を入力してください"
                rows={3}
              />
            </div>
          )}

          <Button type="submit" className="bg-[#4285f4] hover:bg-[#3367d6]" disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "フィードバックを送信"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
