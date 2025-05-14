"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type { BodyPart } from "@/types/form-types"

interface BodyPartItemProps {
  part: BodyPart
  index: number
  onRemove: (id: string) => void
  onChange: (id: string, field: keyof BodyPart, value: string) => void
}

/**
 * 部位項目コンポーネント
 * メモ化して不要な再レンダリングを防止
 */
export const BodyPartItem = memo(function BodyPartItem({ part, index, onRemove, onChange }: BodyPartItemProps) {
  return (
    <div className="p-4 border rounded-md space-y-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">部位 {index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(part.id)}
          className="h-8 w-8 p-0"
          aria-label={`部位${index + 1}を削除`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`bodyPart-${part.id}-name`}>部位名</Label>
          <Input
            id={`bodyPart-${part.id}-name`}
            value={part.name}
            onChange={(e) => onChange(part.id, "name", e.target.value)}
            placeholder="例: 腰部、右膝"
            className="transition-all duration-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`bodyPart-${part.id}-symptoms`}>症状</Label>
          <Input
            id={`bodyPart-${part.id}-symptoms`}
            value={part.symptoms}
            onChange={(e) => onChange(part.id, "symptoms", e.target.value)}
            placeholder="例: 痛み、しびれ"
            className="transition-all duration-100"
          />
        </div>
      </div>
    </div>
  )
})
