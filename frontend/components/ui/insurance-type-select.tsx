"use client"

import { memo } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InsuranceType } from "@/types/form-types"

interface InsuranceTypeSelectProps {
  value: InsuranceType
  onValueChange: (value: InsuranceType) => void
  label?: string
  className?: string
}

/**
 * 保険種別選択コンポーネント
 * メモ化して不要な再レンダリングを防止
 */
export const InsuranceTypeSelect = memo(function InsuranceTypeSelect({
  value,
  onValueChange,
  label = "保険種別",
  className,
}: InsuranceTypeSelectProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="insuranceType">{label}</Label>
      <Select value={value} onValueChange={onValueChange as (value: string) => void}>
        <SelectTrigger id="insuranceType" className="transition-all duration-100">
          <SelectValue placeholder="保険種別を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="national">国民健康保険</SelectItem>
          <SelectItem value="society">組合管掌健康保険（組合健保）</SelectItem>
          <SelectItem value="association">全国健康保険協会管掌健康保険（協会けんぽ）</SelectItem>
          <SelectItem value="mutual">共済組合</SelectItem>
          <SelectItem value="elderly">後期高齢者医療制度</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
})
