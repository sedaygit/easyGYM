import { useCallback, useEffect, useRef, useState } from 'react'
import { readStored, writeStored } from '../lib/storage'

/**
 * useState that mirrors its value into localStorage under `key`.
 * Reads once on mount, writes on every change.
 */
export function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => readStored(key, initialValue))
  const initialRef = useRef(initialValue)

  useEffect(() => {
    writeStored(key, value)
  }, [key, value])

  const reset = useCallback(() => {
    setValue(initialRef.current)
  }, [])

  return [value, setValue, reset]
}
