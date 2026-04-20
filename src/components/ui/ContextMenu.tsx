import { useEffect, useRef } from 'react'
import {
  FilePlus, Copy, Trash2, Edit2, Eye, Download, LayoutTemplate,
  Sun, Moon, Settings, RefreshCw, ChevronRight,
} from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'
import { useFormStore } from '../../store/useFormStore'

export type ContextTarget =
  | { kind: 'canvas-field'; fieldId: string; formId: string; pageId: string }
  | { kind: 'canvas' }
  | { kind: 'form-card'; formId: string }
  | { kind: 'default' }

export interface ContextMenuState {
  x: number
  y: number
  target: ContextTarget
}

interface Props {
  menu: ContextMenuState | null
  onClose: () => void
  onNewForm: () => void
  onShowShortcuts: () => void
}

export default function ContextMenu({ menu, onClose, onNewForm, onShowShortcuts }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const setView = useUIStore((s) => s.setView)
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

  const deleteField = useFormStore((s) => s.deleteField)
  const duplicateField = useFormStore((s) => s.duplicateField)
  const setSelectedField = useFormStore((s) => s.setSelectedField)
  const deleteForm = useFormStore((s) => s.deleteForm)
  const duplicateForm = useFormStore((s) => s.duplicateForm)
  const setActiveForm = useFormStore((s) => s.setActiveForm)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  if (!menu) return null

  // Clamp position so menu doesn't overflow viewport
  const menuW = 200
  const menuH = 260
  const x = Math.min(menu.x, window.innerWidth - menuW - 8)
  const y = Math.min(menu.y, window.innerHeight - menuH - 8)

  function item(
    label: string,
    icon: React.ReactNode,
    action: () => void,
    opts?: { danger?: boolean; shortcut?: string; disabled?: boolean }
  ) {
    return (
      <button
        className={[
          'ctx-menu__item',
          opts?.danger ? 'ctx-menu__item--danger' : '',
          opts?.disabled ? 'ctx-menu__item--disabled' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => { action(); onClose() }}
        key={label}
      >
        {icon}
        {label}
        {opts?.shortcut && <span className="ctx-menu__shortcut">{opts.shortcut}</span>}
      </button>
    )
  }

  const divider = () => <div className="ctx-menu__divider" />
  const label = (text: string) => <div className="ctx-menu__label">{text}</div>

  const { target } = menu

  let items: React.ReactNode[] = []

  if (target.kind === 'canvas-field') {
    items = [
      label('Field'),
      item('Duplicate', <Copy size={14} />, () => duplicateField(target.formId, target.pageId, target.fieldId), { shortcut: 'Ctrl+D' }),
      item('Delete Field', <Trash2 size={14} />, () => {
        if (window.confirm('Delete this field?')) deleteField(target.formId, target.pageId, target.fieldId)
      }, { danger: true, shortcut: 'Del' }),
      divider(),
      label('View'),
      item('Deselect', <ChevronRight size={14} />, () => setSelectedField(null)),
    ]
  } else if (target.kind === 'canvas') {
    items = [
      label('Canvas'),
      item('New Form', <FilePlus size={14} />, onNewForm, { shortcut: 'Ctrl+N' }),
      item('Templates', <LayoutTemplate size={14} />, () => setView('templates')),
      divider(),
      label('Navigate'),
      item('Explorer', <Eye size={14} />, () => setView('explorer')),
      item('Settings', <Settings size={14} />, () => setView('settings')),
    ]
  } else if (target.kind === 'form-card') {
    items = [
      label('Form'),
      item('Open', <Edit2 size={14} />, () => {
        setActiveForm(target.formId)
        setView('builder')
      }),
      item('Duplicate', <Copy size={14} />, () => duplicateForm(target.formId)),
      divider(),
      item('Delete Form', <Trash2 size={14} />, () => {
        if (window.confirm('Delete this form permanently?')) deleteForm(target.formId)
      }, { danger: true }),
    ]
  } else {
    // default — general app actions
    items = [
      label('Formora'),
      item('New Form', <FilePlus size={14} />, onNewForm, { shortcut: 'Ctrl+N' }),
      item('Templates', <LayoutTemplate size={14} />, () => setView('templates')),
      divider(),
      label('View'),
      item('Explorer', <Eye size={14} />, () => setView('explorer')),
      item('Builder', <Edit2 size={14} />, () => setView('builder')),
      item('Settings', <Settings size={14} />, () => setView('settings')),
      divider(),
      label('Appearance'),
      item(theme === 'dark' ? 'Switch to Light' : 'Switch to Dark', theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />, toggleTheme),
      divider(),
      item('Keyboard Shortcuts', <Download size={14} />, onShowShortcuts),
      item('Reload App', <RefreshCw size={14} />, () => window.location.reload()),
    ]
  }

  return (
    <div
      ref={ref}
      className="ctx-menu"
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items}
    </div>
  )
}
