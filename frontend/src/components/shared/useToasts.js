import { useCallback, useRef, useState } from 'react'

export default function useToasts() {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const showToast = useCallback((message, duration = 2200) => {
    const id = idRef.current++
    setToasts((current) => [...current, { id, message }])
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, duration)
  }, [])

  return { toasts, showToast }
}
