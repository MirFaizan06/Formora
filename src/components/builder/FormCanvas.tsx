import { useRef, useState } from 'react'
import { FileText, MousePointer, Layers } from 'lucide-react'
import { useFormStore } from '../../store/useFormStore'
import { createEmptyField } from '../../utils/formSchema'
import CanvasField from './CanvasField'
import PageManager from './PageManager'

export default function FormCanvas() {
  const getActiveForm = useFormStore((s) => s.getActiveForm)
  const getActivePage = useFormStore((s) => s.getActivePage)
  const addField = useFormStore((s) => s.addField)
  const reorderFields = useFormStore((s) => s.reorderFields)

  const dragFromIndex = useRef<number>(-1)
  const dragToIndex = useRef<number>(-1)
  const [isDragOver, setIsDragOver] = useState(false)

  const form = getActiveForm()
  const page = getActivePage()

  if (!form) {
    return (
      <div className="canvas-empty">
        <FileText size={52} className="canvas-empty__icon" />
        <p className="canvas-empty__text">No form selected</p>
        <p className="canvas-empty__sub">Select a form from the Explorer or create a new one</p>
        <div className="canvas-empty__steps">
          <div className="canvas-empty__step">
            <MousePointer size={16} />
            <span>Pick a form in Explorer</span>
          </div>
          <div className="canvas-empty__step">
            <Layers size={16} />
            <span>Drag fields to design it</span>
          </div>
          <div className="canvas-empty__step">
            <FileText size={16} />
            <span>Export to PDF when done</span>
          </div>
        </div>
      </div>
    )
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    setIsDragOver(false)
    const fieldType = e.dataTransfer.getData('fieldType')
    if (fieldType && page) {
      const field = createEmptyField(fieldType as any)
      field.order = page.fields.length
      addField(form!.id, page.id, field)
    }
  }

  function handleReorderDrop() {
    if (dragFromIndex.current === -1 || !form || !page) return
    if (dragFromIndex.current !== dragToIndex.current) {
      reorderFields(form.id, page.id, dragFromIndex.current, dragToIndex.current)
    }
    dragFromIndex.current = -1
    dragToIndex.current = -1
  }

  const sortedFields = page ? [...page.fields].sort((a, b) => a.order - b.order) : []

  return (
    <div className="form-canvas-wrapper">
      <PageManager form={form} />

      <div
        className={`form-canvas${isDragOver ? ' form-canvas--drop-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={(e) => {
          // Only clear if leaving the canvas entirely (not entering a child)
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false)
        }}
        onDrop={handleDrop}
        data-tour="canvas"
      >
        <div className="form-canvas-scroll-inner">
          <div
            className="canvas-page"
            data-orientation={form.settings.orientation}
            data-paper={form.settings.paperSize}
          >
            <div className="canvas-page__header">
              <h2 className="canvas-page__title">{form.title || 'Untitled Form'}</h2>
              {form.description && <p className="canvas-page__desc">{form.description}</p>}
              <div className="canvas-page__meta">
                {form.settings.paperSize} · {form.settings.orientation}
                {page && ` · Page ${(page.order ?? 0) + 1} of ${form.pages.length}`}
              </div>
            </div>

            <div className="canvas-page__fields">
              {sortedFields.length === 0 ? (
                <div className="canvas-drop-hint" style={{ gridColumn: 'span 12' }}>
                  <MousePointer size={20} className="canvas-drop-hint__icon" />
                  <p className="canvas-drop-hint__title">Drop fields here</p>
                  <p className="canvas-drop-hint__sub">Drag from the left panel or click any field to add it</p>
                </div>
              ) : (
                sortedFields.map((field, i) => (
                  <CanvasField
                    key={field.id}
                    field={field}
                    formId={form.id}
                    pageId={page!.id}
                    index={i}
                    onDragStart={(idx) => { dragFromIndex.current = idx }}
                    onDragOver={(idx) => { dragToIndex.current = idx }}
                    onDrop={handleReorderDrop}
                  />
                ))
              )}
            </div>

            {form.settings.showPageNumbers && page && (
              <div className="canvas-page__footer">
                Page {(page.order ?? 0) + 1} of {form.pages.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
