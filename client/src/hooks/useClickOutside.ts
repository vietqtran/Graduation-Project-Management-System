import { RefObject, useEffect, useRef } from 'react'

type Event = MouseEvent | TouchEvent

function useClickOutside<T extends HTMLElement = HTMLElement>(callback: () => void): RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [callback])

  return ref as RefObject<T>
}

export default useClickOutside
