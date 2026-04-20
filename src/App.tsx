import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import AppLayout from './components/layout/AppLayout'
import Splash from './components/ui/Splash'
import Tutorial from './components/ui/Tutorial'
import KeyboardShortcuts from './components/ui/KeyboardShortcuts'
import ContextMenu, { type ContextMenuState, type ContextTarget } from './components/ui/ContextMenu'
import { useUIStore } from './store/useUIStore'
import { useFormStore } from './store/useFormStore'
import { useAutoSave } from './hooks/useAutoSave'
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts'
import { soundManager } from './services/sound/SoundManager'
import { createEmptyForm } from './utils/formSchema'
import type { Form } from './types/form.types'

function resolveContextTarget(e: MouseEvent): ContextTarget {
  const el = e.target as HTMLElement

  // canvas-field
  const fieldEl = el.closest('[data-field-id]') as HTMLElement | null
  if (fieldEl) {
    return {
      kind: 'canvas-field',
      fieldId: fieldEl.dataset.fieldId!,
      formId: fieldEl.dataset.formId!,
      pageId: fieldEl.dataset.pageId!,
    }
  }

  // form card in explorer
  const cardEl = el.closest('[data-form-id]') as HTMLElement | null
  if (cardEl) {
    return { kind: 'form-card', formId: cardEl.dataset.formId! }
  }

  // canvas area
  if (el.closest('[data-tour="canvas"]')) {
    return { kind: 'canvas' }
  }

  return { kind: 'default' }
}

export default function App() {
  const theme = useUIStore((s) => s.theme)
  const setForms = useFormStore((s) => s.setForms)
  const setLoading = useUIStore((s) => s.setLoading)
  const addForm = useFormStore((s) => s.addForm)
  const setActiveForm = useFormStore((s) => s.setActiveForm)
  const setView = useUIStore((s) => s.setView)

  const [showSplash, setShowSplash] = useState(true)
  const [tutorialDone, setTutorialDone] = useState(
    !!localStorage.getItem('formora:tutorial-v2')
  )
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

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

  // Disable Ctrl+A globally (prevent select-all from interfering with the app)
  useEffect(() => {
    function blockCtrlA(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const active = document.activeElement as HTMLElement | null
        // Allow Ctrl+A inside text inputs, textareas, and contenteditable
        if (
          active &&
          (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)
        ) return
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', blockCtrlA)
    return () => document.removeEventListener('keydown', blockCtrlA)
  }, [])

  // Custom context menu
  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      e.preventDefault()
      const target = resolveContextTarget(e)
      setContextMenu({ x: e.clientX, y: e.clientY, target })
    }
    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  const handleNewForm = useCallback(() => {
    const form = createEmptyForm()
    addForm(form)
    setActiveForm(form.id)
    setView('builder')
  }, [addForm, setActiveForm, setView])

  const showTutorial = !showSplash && !tutorialDone

  return (
    <>
      <AppLayout />

      <KeyboardShortcuts open={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <ContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu(null)}
        onNewForm={handleNewForm}
        onShowShortcuts={() => setShowShortcuts((v) => !v)}
      />

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
