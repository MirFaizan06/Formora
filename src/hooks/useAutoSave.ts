import { useEffect, useRef, useState } from 'react'
import { useFormStore } from '../store/useFormStore'

export function useAutoSave() {
  const forms = useFormStore((s) => s.forms)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        if (window.electronAPI) {
          await window.electronAPI.saveForms(forms as unknown)
        }
        setLastSaved(new Date())
      } finally {
        setIsSaving(false)
      }
    }, 1500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [forms])

  return { isSaving, lastSaved }
}
