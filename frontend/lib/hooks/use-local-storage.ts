"use client"

import { useState, useEffect } from "react"

/**
 * カスタムフック: ローカルストレージを使用した状態管理
 *
 * @param key ストレージキー
 * @param initialValue 初期値
 * @returns [値, 値を設定する関数, 値をリセットする関数]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 初期値を取得する関数
  const getInitialValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = useState<T>(getInitialValue)

  // 値を設定する関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // 値をリセットする関数
  const resetValue = () => {
    try {
      setStoredValue(initialValue)

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(initialValue))
      }
    } catch (error) {
      console.error(`Error resetting localStorage key "${key}":`, error)
    }
  }

  // サーバーサイドレンダリング時の値の同期
  useEffect(() => {
    const storedItem = window.localStorage.getItem(key)
    if (storedItem) {
      try {
        setStoredValue(JSON.parse(storedItem))
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error)
      }
    }
  }, [key])

  return [storedValue, setValue, resetValue]
}
