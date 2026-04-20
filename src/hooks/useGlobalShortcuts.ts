import { useEffect } from 'react'
import { shortcutsService } from '../services/shortcuts/shortcutsService'
import { useFormStore } from '../store/useFormStore'
import { useUIStore } from '../store/useUIStore'
import { createEmptyForm } from '../utils/formSchema'

interface Options {
  onShowShortcuts: () => void
}

export function useGlobalShortcuts({ onShowShortcuts }: Options) {
  const addForm = useFormStore((s) => s.addForm)
  const setActiveForm = useFormStore((s) => s.setActiveForm)
  const setView = useUIStore((s) => s.setView)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const togglePreviewMode = useUIStore((s) => s.togglePreviewMode)
  const selectedFieldId = useFormStore((s) => s.selectedFieldId)
  const setSelectedField = useFormStore((s) => s.setSelectedField)
  const deleteField = useFormStore((s) => s.deleteField)
  const duplicateField = useFormStore((s) => s.duplicateField)
  const activePageIndex = useFormStore((s) => s.activePageIndex)
  const setActivePageIndex = useFormStore((s) => s.setActivePageIndex)
  const addPage = useFormStore((s) => s.addPage)
  const getActiveForm = useFormStore((s) => s.getActiveForm)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'

      if (shortcutsService.matchesId(e, 'deselect')) {
        if (selectedFieldId) {
          e.preventDefault()
          setSelectedField(null)
        }
        return
      }

      if (inInput) return

      if (shortcutsService.matchesId(e, 'show-shortcuts')) {
        e.preventDefault()
        onShowShortcuts()
        return
      }

      if (shortcutsService.matchesId(e, 'new-form')) {
        e.preventDefault()
        const form = createEmptyForm()
        addForm(form)
        setActiveForm(form.id)
        setView('builder')
        return
      }

      if (shortcutsService.matchesId(e, 'toggle-sidebar')) {
        e.preventDefault()
        toggleSidebar()
        return
      }

      if (shortcutsService.matchesId(e, 'preview-mode')) {
        e.preventDefault()
        togglePreviewMode()
        return
      }

      if (shortcutsService.matchesId(e, 'open-settings')) {
        e.preventDefault()
        setView('settings')
        return
      }

      if (shortcutsService.matchesId(e, 'delete-field')) {
        const form = getActiveForm()
        if (form && selectedFieldId) {
          const page = form.pages.find((p) => p.fields.some((f) => f.id === selectedFieldId))
          if (page) {
            e.preventDefault()
            deleteField(form.id, page.id, selectedFieldId)
          }
        }
        return
      }

      if (shortcutsService.matchesId(e, 'duplicate-field')) {
        const form = getActiveForm()
        if (form && selectedFieldId) {
          const page = form.pages.find((p) => p.fields.some((f) => f.id === selectedFieldId))
          if (page) {
            e.preventDefault()
            duplicateField(form.id, page.id, selectedFieldId)
          }
        }
        return
      }

      if (shortcutsService.matchesId(e, 'next-page')) {
        const form = getActiveForm()
        if (form && activePageIndex < form.pages.length - 1) {
          e.preventDefault()
          setActivePageIndex(activePageIndex + 1)
        }
        return
      }

      if (shortcutsService.matchesId(e, 'prev-page')) {
        if (activePageIndex > 0) {
          e.preventDefault()
          setActivePageIndex(activePageIndex - 1)
        }
        return
      }

      if (shortcutsService.matchesId(e, 'add-page')) {
        const form = getActiveForm()
        if (form) {
          e.preventDefault()
          addPage(form.id)
        }
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [
    selectedFieldId, activePageIndex,
    addForm, setActiveForm, setView, toggleSidebar, togglePreviewMode,
    deleteField, duplicateField, setSelectedField, setActivePageIndex, addPage,
    getActiveForm, onShowShortcuts,
  ])
}
