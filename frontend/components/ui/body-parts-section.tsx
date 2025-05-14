"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { BodyPartItem } from "@/components/ui/body-part-item"
import type { BodyPart } from "@/types/form-types"

interface BodyPartsSectionProps {
  bodyParts: BodyPart[]
  onAddBodyPart: () => void
  onRemoveBodyPart: (id: string) => void
  onChangeBodyPart: (id: string, field: keyof BodyPart, value: string) => void
  maxBodyParts?: number
}

/**
 * 部位セクションコンポーネント
 * メモ化して不要な再レンダリングを防止
 */
export const BodyPartsSection = memo(function BodyPartsSection({
  bodyParts,
  onAddBodyPart,
  onRemoveBodyPart,
  onChangeBodyPart,
  maxBodyParts = 6,
}: BodyPartsSectionProps) {
  const canAddMoreBodyParts = bodyParts.length < maxBodyParts

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>部位別症状</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddBodyPart}
          disabled={!canAddMoreBodyParts}
          className="transition-all duration-150"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          部位を追加
        </Button>
      </div>

      {bodyParts.length === 0 && (
        <div className="text-sm text-muted-foreground italic">
          部位を追加すると、それぞれの部位ごとに症状を記録できます（最大{maxBodyParts}部位）
        </div>
      )}

      {bodyParts.map((part, index) => (
        <BodyPartItem key={part.id} part={part} index={index} onRemove={onRemoveBodyPart} onChange={onChangeBodyPart} />
      ))}
    </div>
  )
})
