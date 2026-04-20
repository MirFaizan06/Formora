import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Edit2, Check, X } from 'lucide-react'
import Modal from './Modal'
import { shortcutsService } from '../../services/shortcuts/shortcutsService'

interface KeyboardShortcutsProps {
  open: boolean
  onClose: () => void
}

function formatKeys(keys: string[]): string[] {
  return keys
}

function recordKeyCombo(e: KeyboardEvent): string[] {
  const parts: string[] = []
  if (e.ctrlKey || e.metaKey) parts.push('Ctrl')
  if (e.shiftKey) parts.push('Shift')
  if (e.altKey) parts.push('Alt')
  const key = e.key
  if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
    parts.push(key === ' ' ? 'Space' : key)
  }
  return parts
}

export default function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  const [shortcuts, setShortcuts] = useState(() => shortcutsService.getAll())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [recording, setRecording] = useState<string[]>([])

  useEffect(() => {
    const unsub = shortcutsService.subscribe(() => {
      setShortcuts(shortcutsService.getAll())
    })
    return unsub
  }, [])

  const startEdit = useCallback((id: string) => {
    setEditingId(id)
    setRecording([])
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setRecording([])
  }, [])

  const saveEdit = useCallback((id: string) => {
    if (recording.length > 0) {
      shortcutsService.setKeys(id, recording)
    }
    setEditingId(null)
    setRecording([])
  }, [recording])

  const resetShortcut = useCallback((id: string) => {
    shortcutsService.resetKeys(id)
  }, [])

  const resetAll = useCallback(() => {
    shortcutsService.resetAll()
  }, [])

  useEffect(() => {
    if (!editingId) return
    function handler(e: KeyboardEvent) {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Escape') { cancelEdit(); return }
      const combo = recordKeyCombo(e)
      if (combo.length > 0) setRecording(combo)
    }
    window.addEventListener('keydown', handler, { capture: true })
    return () => window.removeEventListener('keydown', handler, { capture: true })
  }, [editingId, cancelEdit])

  // Group by category
  const categories = Array.from(new Set(shortcuts.map((s) => s.category)))

  const hasAnyCustom = shortcuts.some((s) => s.isCustom)

  return (
    <Modal open={open} title="Keyboard Shortcuts" onClose={onClose} width={560}>
      <div className="keyboard-shortcuts">
        {hasAnyCustom && (
          <div className="kbd-reset-all-row">
            <button className="btn btn-ghost btn-sm" onClick={resetAll}>
              <RotateCcw size={13} /> Reset all to defaults
            </button>
          </div>
        )}

        {categories.map((cat) => (
          <div key={cat} className="kbd-category">
            <div className="kbd-category__title">{cat}</div>
            <table className="keyboard-shortcuts__table">
              <tbody>
                {shortcuts.filter((s) => s.category === cat).map((s) => (
                  <tr key={s.id} className={s.isCustom ? 'kbd-row--custom' : ''}>
                    <td className="kbd-action-cell">{s.label}</td>
                    <td className="kbd-keys-cell">
                      {editingId === s.id ? (
                        <div className="kbd-recording">
                          <span className="kbd-recording__hint">
                            {recording.length > 0
                              ? recording.map((k, i) => <span key={i} className="kbd">{k}</span>)
                              : 'Press a key combo…'}
                          </span>
                          <button className="btn btn-ghost btn-icon btn-xs" title="Save" onClick={() => saveEdit(s.id)}>
                            <Check size={13} />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-xs" title="Cancel" onClick={cancelEdit}>
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <span className="kbd-group">
                          {formatKeys(s.keys).map((key, i) => (
                            <span key={i} className="kbd">{key}</span>
                          ))}
                        </span>
                      )}
                    </td>
                    <td className="kbd-actions-cell">
                      {editingId !== s.id && (
                        <div className="kbd-row-actions">
                          <button
                            className="btn btn-ghost btn-icon btn-xs"
                            title="Edit keybinding"
                            onClick={() => startEdit(s.id)}
                          >
                            <Edit2 size={12} />
                          </button>
                          {s.isCustom && (
                            <button
                              className="btn btn-ghost btn-icon btn-xs"
                              title="Reset to default"
                              onClick={() => resetShortcut(s.id)}
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <p className="kbd-hint">Click <Edit2 size={11} style={{ display:'inline', verticalAlign:'middle' }} /> to rebind any shortcut. Changes save immediately.</p>
      </div>
    </Modal>
  )
}

/** Self-contained root — wires the show-shortcuts key globally via useGlobalShortcuts in App. */
export function KeyboardShortcutsRoot() {
  return null // placeholder — actual wiring is in App.tsx via useGlobalShortcuts
}
