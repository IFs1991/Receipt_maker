"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { FormStatusMessage } from "@/components/ui/form-status-message"
import { BodyPartsSection } from "@/components/ui/body-parts-section"
import { InsuranceTypeSelect } from "@/components/ui/insurance-type-select"
import { addBodyPart, removeBodyPart, updateBodyPart } from "@/lib/utils/form-utils"
import type { BodyPart, ReturnInfoFormState, FormStatus, InsuranceType, ReturnInfoSubmitDto } from "@/types/form-types"
import apiClient from "@/lib/apiClient"; // APIクライアントをインポート

// 初期フォーム状態
const initialFormState: ReturnInfoFormState = {
  age: "",
  gender: "",
  symptoms: "",
  returnReason: "",
  returnType: "",
  returnDate: undefined,
  initialInjuryReason: "",
  injuryReason: "",
  insuranceType: "",
}

export default function ReturnInfoForm() {
  // ローカルストレージを使用して状態を保存
  const [formState, setFormState, resetFormState] = useLocalStorage<ReturnInfoFormState>(
    "return-info-form",
    initialFormState,
  )

  // 部位の状態
  const [bodyParts, setBodyParts] = useLocalStorage<BodyPart[]>("return-info-body-parts", [])

  // フォーム送信状態
  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 入力ハンドラー
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target
      setFormState((prev) => ({ ...prev, [id]: value }))
    },
    [setFormState],
  )

  // セレクトハンドラー
  const handleSelectChange = useCallback(
    (value: string, field: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }))
    },
    [setFormState],
  )

  // 日付ハンドラー
  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      setFormState((prev) => ({ ...prev, returnDate: date }))
    },
    [setFormState],
  )

  // 部位入力ハンドラー
  const handleBodyPartChange = useCallback(
    (id: string, field: keyof BodyPart, value: string) => {
      setBodyParts((prev) => updateBodyPart(prev, id, field, value))
    },
    [setBodyParts],
  )

  // 部位追加ハンドラー
  const handleAddBodyPart = useCallback(() => {
    setBodyParts((prev) => addBodyPart(prev))
  }, [setBodyParts])

  // 部位削除ハンドラー
  const handleRemoveBodyPart = useCallback(
    (id: string) => {
      setBodyParts((prev) => removeBodyPart(prev, id))
    },
    [setBodyParts],
  )

  // フォーム送信ハンドラー
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      setFormStatus("submitting")

      try {
        // フォームデータをバックエンドのDTOスキーマに合わせて変換
        const payload: ReturnInfoSubmitDto = {
          age: formState.age,
          gender: formState.gender,
          symptoms: formState.symptoms,
          returnReasonText: formState.returnReason,
          returnType: formState.returnType,
          returnDate: formState.returnDate,
          initialInjuryReasonText: formState.initialInjuryReason,
          injuryReasonText: formState.injuryReason,
          insuranceType: formState.insuranceType,
          bodyParts,
        };

        // POST /return-info を使用
        const response = await apiClient.post<{ id: string; [key: string]: any }>("/return-info", payload);

        // レスポンスデータの処理
        if (response && response.id) {
          // 成功状態を設定
          setFormStatus("success")

          // フォームをリセット（遅延付き）
          setTimeout(() => {
            resetFormState()
            setBodyParts([])
            setFormStatus("idle")
          }, 2000)
        } else {
          console.error("不完全なレスポンス:", response);
          setFormStatus("error")
        }
      } catch (err: any) {
        console.error("差し戻し情報送信エラー:", err)

        // 詳細なエラーメッセージの取得と処理
        let errorMessage = "保存中にエラーが発生しました。"
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message
        } else if (err.message) {
          errorMessage = err.message
        }

        // エラー状態の設定
        setFormStatus("error")
      } finally {
        setIsSubmitting(false)
      }
    },
    [formState, bodyParts, resetFormState, setBodyParts, setFormState],
  )

  // 日付フォーマット（メモ化）
  const formattedDate = useMemo(() => {
    return formState.returnDate ? format(formState.returnDate, "yyyy年MM月dd日", { locale: ja }) : null
  }, [formState.returnDate])

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>差し戻し情報入力</CardTitle>
        <CardDescription>保険申請が差し戻された場合の情報を入力してください</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <FormStatusMessage
            status={formStatus}
            successMessage="差し戻し情報が保存されました"
            errorMessage="エラーが発生しました。再度お試しください。"
          />

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
              <Select value={formState.gender} onValueChange={(value: string) => handleSelectChange(value, "gender")}>
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

          {/* 部位セクション */}
          <BodyPartsSection
            bodyParts={bodyParts}
            onAddBodyPart={handleAddBodyPart}
            onRemoveBodyPart={handleRemoveBodyPart}
            onChangeBodyPart={handleBodyPartChange}
          />

          <div className="space-y-2">
            <Label htmlFor="returnDate">差し戻し日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal transition-all duration-100",
                    !formState.returnDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDate || <span>日付を選択</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={formState.returnDate} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnType">差し戻し種別</Label>
            <Select value={formState.returnType} onValueChange={(value: string) => handleSelectChange(value, "returnType")}>
              <SelectTrigger id="returnType" className="transition-all duration-100">
                <SelectValue placeholder="差し戻し種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="information_missing">情報不足</SelectItem>
                <SelectItem value="incorrect_information">情報誤り</SelectItem>
                <SelectItem value="documentation_required">追加書類必要</SelectItem>
                <SelectItem value="format_error">書式エラー</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnReason">差し戻し理由</Label>
            <Textarea
              id="returnReason"
              value={formState.returnReason}
              onChange={handleInputChange}
              placeholder="差し戻しの詳細な理由を入力してください"
              rows={4}
              className="resize-none transition-all duration-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialInjuryReason">初回申請時の受傷理由</Label>
            <Textarea
              id="initialInjuryReason"
              value={formState.initialInjuryReason}
              onChange={handleInputChange}
              placeholder="初回申請時に記載した受傷理由を入力してください"
              rows={3}
              className="resize-none transition-all duration-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="injuryReason">受傷理由</Label>
            <Textarea
              id="injuryReason"
              value={formState.injuryReason}
              onChange={handleInputChange}
              placeholder="受傷理由や経緯について入力してください"
              rows={3}
              className="resize-none transition-all duration-100"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className={cn("bg-[#4285f4] hover:bg-[#3367d6] transition-all duration-150", isSubmitting && "opacity-90")}
            disabled={isSubmitting}
          >
            {isSubmitting ? "保存中..." : "保存する"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
