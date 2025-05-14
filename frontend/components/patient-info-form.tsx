"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import apiClient from "@/lib/apiClient" // APIクライアントをインポート
import { InsuranceTypeSelect } from "@/components/ui/insurance-type-select"
import type { PatientInfoFormState, InsuranceType } from "@/types/form-types"

// 初期フォーム状態
const initialFormState: PatientInfoFormState = {
  age: "",
  gender: "",
  symptoms: "",
  insuranceType: "",
}

export default function PatientInfoForm() {
  // ローカルストレージを使用して状態を保存
  const [formState, setFormState] = useLocalStorage<PatientInfoFormState>("patient-info-form", initialFormState)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 入力ハンドラー
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target
      setFormState((prev) => ({ ...prev, [id]: value }))
      setIsSaved(false)
    },
    [setFormState],
  )

  // セレクトハンドラー
  const handleSelectChange = useCallback(
    (value: string | InsuranceType, field: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }))
      setIsSaved(false)
    },
    [setFormState],
  )

  // フォーム送信ハンドラー
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setIsSaved(false)
      setError(null)

      try {
        // apiClientを使用してバックエンドにデータを送信
        // conect.yaml の指示に基づき、PUT /users/me/profile を使用
        const response = await apiClient.put("/users/me/profile", formState)

        // 成功した場合
        setIsSaved(true)
        // 必要に応じて、レスポンスデータでローカル状態を更新
        if (response && typeof response === 'object') {
          setFormState(prev => ({...prev, ...response}))
        }
        setTimeout(() => {
          setIsSaved(false)
        }, 3000)
      } catch (err: any) {
        console.error("Patient info submission error:", err)
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
    [formState, setFormState], // setFormState を依存配列に追加
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>患者情報</CardTitle>
        <CardDescription>患者の基本情報を入力してください</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">年齢</Label>
              <Input
                id="age"
                type="number"
                value={formState.age}
                onChange={handleInputChange}
                placeholder="例: 45"
                min="0"
                max="120"
                className="transition-all duration-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">性別</Label>
              <Select value={formState.gender} onValueChange={(value) => handleSelectChange(value, "gender")}>
                <SelectTrigger id="gender" className="transition-all duration-100">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InsuranceTypeSelect
              value={formState.insuranceType}
              onValueChange={(value: InsuranceType) => handleSelectChange(value, "insuranceType")}
              className="md:col-span-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symptoms">主訴・症状</Label>
            <Input
              id="symptoms"
              value={formState.symptoms}
              onChange={handleInputChange}
              placeholder="例: 腰痛、右膝の痛み"
              className="transition-all duration-100"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#4285f4] hover:bg-[#3367d6] transition-all duration-150" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
            {isSaved && (
              <div className="ml-4 text-green-600 flex items-center animate-in fade-in duration-300">保存しました</div>
            )}
            {error && (
              <div className="ml-4 text-red-600 flex items-center animate-in fade-in duration-300">{error}</div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
