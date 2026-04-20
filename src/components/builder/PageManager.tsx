import { useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useFormStore } from '../../store/useFormStore'
import type { Form } from '../../types/form.types'

interface PageManagerProps {
  form: Form
}

export default function PageManager({ form }: PageManagerProps) {
  const activePageIndex = useFormStore((s) => s.activePageIndex)
  const setActivePageIndex = useFormStore((s) => s.setActivePageIndex)
  const addPage = useFormStore((s) => s.addPage)
  const deletePage = useFormStore((s) => s.deletePage)
  const updatePage = useFormStore((s) => s.updatePage)

  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // Drag-to-reorder state
  const dragFromIndex = useRef<number>(-1)
  const dragOverIndex = useRef<number>(-1)
  const [dragActive, setDragActive] = useState(false)

  function startRename(pageId: string, currentTitle: string) {
    setRenamingId(pageId)
    setRenameValue(currentTitle)
  }

  function commitRename(pageId: string) {
    const trimmed = renameValue.trim()
    if (trimmed) {
      updatePage(form.id, pageId, { title: trimmed })
    }
    setRenamingId(null)
    setRenameValue('')
  }

  function handleRenameKeyDown(e: React.KeyboardEvent, pageId: string) {
    if (e.key === 'Enter') commitRename(pageId)
    if (e.key === 'Escape') { setRenamingId(null); setRenameValue('') }
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    dragFromIndex.current = index
    setDragActive(true)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    dragOverIndex.current = index
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const from = dragFromIndex.current
    const to = dragOverIndex.current

    if (from === -1 || to === -1 || from === to) {
      setDragActive(false)
      return
    }

    // Reorder pages by rebuilding array and calling updatePage for each
    const pages = [...form.pages].sort((a, b) => a.order - b.order)
    const [moved] = pages.splice(from, 1)
    pages.splice(to, 0, moved)
    pages.forEach((p, i) => {
      updatePage(form.id, p.id, { order: i })
    })

    // Keep the same logical page selected
    setActivePageIndex(to)
    dragFromIndex.current = -1
    dragOverIndex.current = -1
    setDragActive(false)
  }

  function handleDragEnd() {
    dragFromIndex.current = -1
    dragOverIndex.current = -1
    setDragActive(false)
  }

  const sortedPages = [...form.pages].sort((a, b) => a.order - b.order)

  return (
    <div className={`canvas-page-tabs${dragActive ? ' canvas-page-tabs--dragging' : ''}`}>
      {sortedPages.map((p, i) => (
        <div
          key={p.id}
          className={`canvas-page-tab${i === activePageIndex ? ' canvas-page-tab--active' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onClick={() => { if (renamingId !== p.id) setActivePageIndex(i) }}
          onDoubleClick={() => startRename(p.id, p.title)}
          title="Double-click to rename · Drag to reorder"
        >
          {renamingId === p.id ? (
            <input
              className="canvas-page-tab__rename-input"
              value={renameValue}
              autoFocus
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => commitRename(p.id)}
              onKeyDown={(e) => handleRenameKeyDown(e, p.id)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="canvas-page-tab__label">{p.title || `Page ${i + 1}`}</span>
          )}

          {form.pages.length > 1 && renamingId !== p.id && (
            <button
              className="canvas-page-tab__delete"
              title="Delete page"
              onClick={(e) => {
                e.stopPropagation()
                deletePage(form.id, p.id)
              }}
            >
              <X size={11} />
            </button>
          )}
        </div>
      ))}

      <button
        className="canvas-page-tab canvas-page-tab--add"
        title="Add page"
        onClick={() => addPage(form.id)}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
