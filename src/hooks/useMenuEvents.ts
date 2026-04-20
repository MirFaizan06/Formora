import { useEffect } from 'react'
import { useElectron } from './useElectron'
import { useUIStore } from '../store/useUIStore'

interface MenuEventCallbacks {
  onNewForm?: () => void
  onSave?: () => void
}

export function useMenuEvents({ onNewForm, onSave }: MenuEventCallbacks = {}) {
  const api = useElectron()
  const toggleTheme = useUIStore((s) => s.toggleTheme)
  const setView = useUIStore((s) => s.setView)

  useEffect(() => {
    if (!api?.onMenuEvent) return

    const unsubNewForm = api.onMenuEvent('menu:new-form', () => {
      setView('builder')
      onNewForm?.()
    })

    const unsubSave = api.onMenuEvent('menu:save', () => {
      onSave?.()
    })

    const unsubTheme = api.onMenuEvent('menu:toggle-theme', () => {
      toggleTheme()
    })

    return () => {
      unsubNewForm?.()
      unsubSave?.()
      unsubTheme?.()
    }
  }, [api, onNewForm, onSave, toggleTheme, setView])
}
