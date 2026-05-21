import { useEffect, useState } from 'react'

/**
 * Like useState, but the value is mirrored to localStorage under `key` and
 * restored on the next mount. Storage failures (disabled storage, quota,
 * malformed JSON) fall back to `initial` rather than throwing.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write failures — persistence is best-effort.
    }
  }, [key, value])

  return [value, setValue]
}
