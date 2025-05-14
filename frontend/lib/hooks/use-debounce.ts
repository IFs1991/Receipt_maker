"use client"

import { useEffect, useState } from "react"

/**
 * カスタムフック: 値の変更を遅延させる
 *
 * @param value 監視する値
 * @param delay 遅延時間（ミリ秒）
 * @returns 遅延後の値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
