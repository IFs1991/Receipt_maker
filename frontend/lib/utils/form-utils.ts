import type { BodyPart } from "@/types/form-types"

/**
 * 新しい空の部位オブジェクトを作成
 *
 * @returns 新しい部位オブジェクト
 */
export function createEmptyBodyPart(): BodyPart {
  return {
    id: Date.now().toString(),
    name: "",
    symptoms: "",
  }
}

/**
 * フォームの状態をリセット
 *
 * @param setFormState フォーム状態を設定する関数
 * @param initialState 初期状態
 */
export function resetFormState<T>(setFormState: (state: T) => void, initialState: T): void {
  setFormState(initialState)
}

/**
 * 部位の配列を更新
 *
 * @param bodyParts 現在の部位配列
 * @param id 更新する部位のID
 * @param field 更新するフィールド
 * @param value 新しい値
 * @returns 更新された部位配列
 */
export function updateBodyPart(bodyParts: BodyPart[], id: string, field: keyof BodyPart, value: string): BodyPart[] {
  return bodyParts.map((part) => (part.id === id ? { ...part, [field]: value } : part))
}

/**
 * 部位を削除
 *
 * @param bodyParts 現在の部位配列
 * @param id 削除する部位のID
 * @returns 更新された部位配列
 */
export function removeBodyPart(bodyParts: BodyPart[], id: string): BodyPart[] {
  return bodyParts.filter((part) => part.id !== id)
}

/**
 * 部位を追加（最大数を超えないように）
 *
 * @param bodyParts 現在の部位配列
 * @param maxBodyParts 最大部位数
 * @returns 更新された部位配列、または元の配列（最大数に達している場合）
 */
export function addBodyPart(bodyParts: BodyPart[], maxBodyParts = 6): BodyPart[] {
  if (bodyParts.length >= maxBodyParts) {
    return bodyParts
  }

  return [...bodyParts, createEmptyBodyPart()]
}
