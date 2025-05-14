"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, PlusCircle, X } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { FormStatusMessage } from "@/components/ui/form-status-message"
import { BodyPartsSection } from "@/components/ui/body-parts-section"
import { InsuranceTypeSelect } from "@/components/ui/insurance-type-select"
import { addBodyPart, removeBodyPart, updateBodyPart } from "@/lib/utils/form-utils"
import type { BodyPart, ApprovalInfoFormState, FormStatus, InsuranceType, ApprovalInfoSubmitDto } from "@/types/form-types"
import apiClient from "@/lib/apiClient"

// 初期フォーム状態
const initialFormState: ApprovalInfoFormState = {
  age: "",
  gender: "",
  symptoms: "",
  approvalDate: undefined,
  isFullApproval: true,
  partialApprovalDetails: "",
  injuryReason: "",
  insuranceType: "",
}

export default function ApprovalInfoForm() {
  // ローカルストレージを使用して状態を保存
  const [formState, setFormState, resetFormState] = useLocalStorage<ApprovalInfoFormState>(
    "approval-info-form",
    initialFormState,
  )

  // 部位の状態
  const [bodyParts, setBodyParts] = useLocalStorage<BodyPart[]>("approval-info-body-parts", [])

  // 承認された治療の状態
  const [approvedTreatments, setApprovedTreatments] = useLocalStorage<string[]>("approval-info-treatments", [])
  const [newTreatment, setNewTreatment] = useState("")

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
    (value: string | InsuranceType, field: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }))
    },
    [setFormState],
  )

  // 日付ハンドラー
  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      setFormState((prev) => ({ ...prev, approvalDate: date }))
    },
    [setFormState],
  )

  // チェックボックスハンドラー
  const handleCheckboxChange = useCallback(
    (checked: boolean | "indeterminate") => {
      if (typeof checked === "boolean") {
        setFormState((prev) => ({ ...prev, isFullApproval: checked }))
      }
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

  // 治療追加ハンドラー
  const handleAddTreatment = useCallback(() => {
    if (newTreatment.trim() !== "" && !approvedTreatments.includes(newTreatment)) {
      setApprovedTreatments((prev) => [...prev, newTreatment])
      setNewTreatment("")
    }
  }, [newTreatment, approvedTreatments, setApprovedTreatments])

  // 治療削除ハンドラー
  const handleRemoveTreatment = useCallback(
    (treatment: string) => {
      setApprovedTreatments((prev) => prev.filter((t) => t !== treatment))
    },
    [setApprovedTreatments],
  )

  // 新しい治療入力ハンドラー
  const handleNewTreatmentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTreatment(e.target.value)
  }, [])

  // フォーム送信ハンドラー
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      setFormStatus("submitting")

      try {
        // APIクライアントを使用してバックエンドにデータを送信
        const payload: ApprovalInfoSubmitDto = {
          ...formState,
          bodyParts,
          approvedTreatments,
        };

        // conect.yamlで指定されたエンドポイントにデータを送信
        const response = await apiClient.post<{ id: string; [key: string]: any }>("/approval-info", payload);

        // レスポンスを確認
        if (response && response.id) {
          // 成功状態を設定
          setFormStatus("success")

          // フォームをリセット（遅延付き）
          setTimeout(() => {
            resetFormState()
            setBodyParts([])
            setApprovedTreatments([])
            setNewTreatment("")
            setFormStatus("idle")
          }, 2000)
        } else {
          console.error("不完全なレスポンス:", response);
          setFormStatus("error")
        }
      } catch (err: any) {
        console.error("保険申請通過情報送信エラー:", err)

        // 詳細なエラーメッセージの取得と処理
        let errorMessage = "保存中にエラーが発生しました。"
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message
        } else if (err.message) {
          errorMessage = err.message
        }

        setFormStatus("error")
      } finally {
        setIsSubmitting(false)
      }
    },
    [formState, bodyParts, approvedTreatments, resetFormState, setBodyParts, setApprovedTreatments],
  )

  // 日付フォーマット（メモ化）
  const formattedDate = useMemo(() => {
    return formState.approvalDate ? format(formState.approvalDate, "yyyy年MM月dd日", { locale: ja }) : null
  }, [formState.approvalDate])

  // 治療リスト（メモ化）
  const treatmentsList = useMemo(() => {
    return approvedTreatments.map((treatment, index) => (
      <Badge key={index} variant="secondary" className="flex items-center gap-1 animate-in fade-in duration-300">
        {treatment}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={() => handleRemoveTreatment(treatment)}
          aria-label={`${treatment}を削除`}
        >
          <X className="h-3 w-3" />
        </Button>
      </Badge>
    ))
  }, [approvedTreatments, handleRemoveTreatment])

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>保険申請通過情報入力</CardTitle>
        <CardDescription>保険申請が承認された場合の情報を入力してください</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <FormStatusMessage
            status={formStatus}
            successMessage="保険申請通過情報が保存されました"
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
            <Label htmlFor="approvalDate">承認日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal transition-all duration-100",
                    !formState.approvalDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDate || <span>日付を選択</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={formState.approvalDate} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="isFullApproval" checked={formState.isFullApproval} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="isFullApproval">全ての申請内容が承認されました</Label>
            </div>
          </div>

          {!formState.isFullApproval && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Label htmlFor="partialApprovalDetails">一部承認の詳細</Label>
              <Textarea
                id="partialApprovalDetails"
                value={formState.partialApprovalDetails}
                onChange={handleInputChange}
                placeholder="一部のみ承認された場合の詳細を入力してください"
                rows={3}
                className="resize-none transition-all duration-100"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>承認された治療</Label>
            <div className="flex flex-wrap gap-2 mb-2">{treatmentsList}</div>
            <div className="flex gap-2">
              <Input
                value={newTreatment}
                onChange={handleNewTreatmentChange}
                placeholder="治療内容を入力"
                className="flex-1 transition-all duration-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTreatment()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTreatment}
                className="flex-shrink-0 transition-all duration-150"
                disabled={!newTreatment.trim()}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                追加
              </Button>
            </div>
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
