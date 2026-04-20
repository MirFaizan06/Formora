import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import AppLayout from './components/layout/AppLayout'
import Splash from './components/ui/Splash'
import Tutorial from './components/ui/Tutorial'
import KeyboardShortcuts from './components/ui/KeyboardShortcuts'
import { useUIStore } from './store/useUIStore'
import { useFormStore } from './store/useFormStore'
import { useAutoSave } from './hooks/useAutoSave'
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts'
import { soundManager } from './services/sound/SoundManager'
import type { Form } from './types/form.types'

export default function App() {
  const theme = useUIStore((s) => s.theme)
  const setForms = useFormStore((s) => s.setForms)
  const setLoading = useUIStore((s) => s.setLoading)

  const [showSplash, setShowSplash] = useState(
    !localStorage.getItem('formora:splash-v2')
  )
  const [tutorialDone, setTutorialDone] = useState(
    !!localStorage.getItem('formora:tutorial-v2')
  )
  const [showShortcuts, setShowShortcuts] = useState(false)

  useAutoSave()

  useGlobalShortcuts({ onShowShortcuts: () => setShowShortcuts((v) => !v) })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    async function loadForms() {
      if (!window.electronAPI) return
      setLoading(true)
      try {
        const forms = await window.electronAPI.loadForms()
        setForms(forms as Form[])
      } finally {
        setLoading(false)
      }
    }
    loadForms()
  }, [])

  const showTutorial = !showSplash && !tutorialDone

  return (
    <>
      <AppLayout />

      <KeyboardShortcuts open={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <AnimatePresence>
        {showSplash && (
          <Splash onDone={() => {
            setShowSplash(false)
            soundManager.play('startup')
          }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTutorial && (
          <Tutorial onDone={() => setTutorialDone(true)} />
        )}
      </AnimatePresence>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
          },
        }}
      />
    </>
  )
}
