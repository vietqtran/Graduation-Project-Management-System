import { useState, useEffect } from 'react'

/**
 * useDebounce Hook
 * Delays updating a value until after a specified delay time.
 * Useful for optimizing performance in search inputs, API requests, etc.
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
