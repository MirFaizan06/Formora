import { useState } from 'react'
import { GripVertical, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react'
import type { FormField, FieldType } from '../../types/form.types'
import { useFormStore } from '../../store/useFormStore'
import { getFieldColSpan, widthToColSpan } from '../../utils/formSchema'
import { soundManager } from '../../services/sound/SoundManager'

interface CanvasFieldProps {
  field: FormField
  formId: string
  pageId: string
  index: number
  onDragStart: (index: number) => void
  onDragOver: (index: number) => void
  onDrop: () => void
}

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: 'Text', textarea: 'Textarea', number: 'Number', email: 'Email', phone: 'Phone',
  date: 'Date', time: 'Time', checkbox: 'Checkbox', dropdown: 'Dropdown',
  signature: 'Signature', radio: 'Radio', 'checkbox-group': 'Checkboxes',
  address: 'Address', 'fill-blank': 'Fill Blank', table: 'Table',
  rating: 'Rating', 'form-header': 'Header', divider: 'Divider', label: 'Label',
}

const FIELD_PREVIEWS: Record<string, React.ReactNode> = {
  text:     <input className="canvas-field__preview-input" placeholder="Text input…" readOnly />,
  textarea: <textarea className="canvas-field__preview-input canvas-field__preview-textarea" placeholder="Long text…" readOnly />,
  number:   <input type="number" className="canvas-field__preview-input" placeholder="0" readOnly />,
  email:    <input type="email" className="canvas-field__preview-input" placeholder="email@example.com" readOnly />,
  phone:    <input type="tel" className="canvas-field__preview-input" placeholder="(555) 000-0000" readOnly />,
  date:     <input type="date" className="canvas-field__preview-input" readOnly />,
  time:     <input type="time" className="canvas-field__preview-input" readOnly />,
  checkbox: <label className="canvas-field__preview-check"><input type="checkbox" disabled /> Option</label>,
  dropdown: <select className="canvas-field__preview-input" disabled><option>Select option…</option></select>,
  signature:<div className="canvas-field__preview-sig">✏ Sign here</div>,
}

const SIMPLE_TYPES: FieldType[] = [
  'text', 'textarea', 'number', 'email', 'phone', 'date', 'time', 'checkbox', 'dropdown', 'signature',
]

export default function CanvasField({
  field, formId, pageId, index, onDragStart, onDragOver, onDrop,
}: CanvasFieldProps) {
  const selectedFieldId = useFormStore((s) => s.selectedFieldId)
  const setSelectedField = useFormStore((s) => s.setSelectedField)
  const deleteField = useFormStore((s) => s.deleteField)
  const duplicateField = useFormStore((s) => s.duplicateField)
  const updateField = useFormStore((s) => s.updateField)
  const [isDragOver, setIsDragOver] = useState(false)

  const isSelected = selectedFieldId === field.id
  const colSpan = getFieldColSpan(field)

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    soundManager.play('warning')
    if (window.confirm(`Delete "${field.label || field.type}" field?`)) {
      deleteField(formId, pageId, field.id)
    }
  }

  function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation()
    duplicateField(formId, pageId, field.id)
    soundManager.play('success')
  }

  function nudgeSpan(delta: number) {
    const current = field.gridColSpan ?? widthToColSpan(field.width)
    const next = Math.min(12, Math.max(1, current + delta))
    updateField(formId, pageId, field.id, { gridColSpan: next })
  }

  return (
    <div
      className={[
        'canvas-field',
        `canvas-field--${field.type}`,
        isSelected ? 'canvas-field--selected' : '',
        isDragOver ? 'canvas-field--drag-over' : '',
      ].filter(Boolean).join(' ')}
      style={{ gridColumn: `span ${colSpan}` }}
      onClick={() => setSelectedField(field.id)}
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart(index) }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); onDragOver(index) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => { setIsDragOver(false); onDrop() }}
    >
      {/* Drag handle */}
      <div className="field-drag-handle" title="Drag to reorder">
        <GripVertical size={14} />
      </div>

      {/* Field content */}
      <div className="canvas-field__content">
        {field.type === 'form-header' && (
          <div className="canvas-field__header-preview">
            <div className="canvas-field__header-title">{field.label || 'Form Title'}</div>
            {field.metadata && <div className="canvas-field__header-subtitle">{field.metadata}</div>}
          </div>
        )}

        {field.type === 'divider' && (
          <hr className="canvas-field__preview-divider" />
        )}

        {field.type === 'label' && (
          <p className="canvas-field__label-text">{field.label || 'Label text'}</p>
        )}

        {field.type !== 'form-header' && field.type !== 'divider' && field.type !== 'label' && (
          <label className="canvas-field__label">
            {field.label || <span className="canvas-field__label--empty">Untitled field</span>}
            {field.required && <span className="canvas-field__required" title="Required">*</span>}
          </label>
        )}

        {SIMPLE_TYPES.includes(field.type) && FIELD_PREVIEWS[field.type]}

        {field.type === 'rating' && (
          <div className="canvas-field__preview-rating" title={`${field.maxRating ?? 5} stars`}>
            {'★'.repeat(Math.min(field.maxRating ?? 5, 10))}
          </div>
        )}

        {(field.type === 'radio' || field.type === 'checkbox-group') && (
          <div className="canvas-field__preview-options">
            {(field.options ?? []).slice(0, 3).map((o) => (
              <label key={o.value} className="canvas-field__preview-check">
                <input type={field.type === 'radio' ? 'radio' : 'checkbox'} disabled />
                {o.label}
              </label>
            ))}
            {(field.options?.length ?? 0) === 0 && (
              <span className="canvas-field__preview-more">No options yet — edit in properties panel</span>
            )}
            {(field.options?.length ?? 0) > 3 && (
              <span className="canvas-field__preview-more">+{(field.options?.length ?? 0) - 3} more</span>
            )}
          </div>
        )}

        {field.type === 'address' && (
          <div className="canvas-field__preview-address">
            <div className="canvas-field__preview-input">Street Address</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <div className="canvas-field__preview-input" style={{ flex: 2 }}>City</div>
              <div className="canvas-field__preview-input" style={{ flex: 1 }}>State</div>
              <div className="canvas-field__preview-input" style={{ flex: 1 }}>ZIP</div>
            </div>
          </div>
        )}

        {field.type === 'fill-blank' && (
          <div className="canvas-field__preview-fillblank">
            {(field.metadata ?? 'Complete the sentence: ___').split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="canvas-field__blank">________</span>}
              </span>
            ))}
          </div>
        )}

        {field.type === 'table' && (
          <div className="canvas-field__preview-table">
            <table>
              <thead>
                <tr>
                  {(field.tableColumns?.length ? field.tableColumns : ['Column 1', 'Column 2', 'Column 3'])
                    .map((c, i) => <th key={i}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.min(field.tableRows ?? 2, 2) }).map((_, i) => (
                  <tr key={i}>
                    {(field.tableColumns?.length ? field.tableColumns : ['', '', '']).map((_, j) => (
                      <td key={j} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="canvas-field__actions-row">
        {isSelected && (
          <div className="canvas-field__span-nudge" title="Adjust column width">
            <button className="btn btn-ghost btn-icon btn-xs" onClick={(e) => { e.stopPropagation(); nudgeSpan(-1) }}>
              <ChevronLeft size={11} />
            </button>
            <span className="canvas-field__span-label">{colSpan}</span>
            <button className="btn btn-ghost btn-icon btn-xs" onClick={(e) => { e.stopPropagation(); nudgeSpan(1) }}>
              <ChevronRight size={11} />
            </button>
          </div>
        )}
        <span className="canvas-field__type-badge">{FIELD_TYPE_LABELS[field.type] ?? field.type}</span>
        <button
          className="canvas-field__action btn btn-ghost btn-icon"
          onClick={handleDuplicate}
          title="Duplicate field (Ctrl+D)"
        >
          <Copy size={12} />
        </button>
        <button
          className="canvas-field__action canvas-field__delete btn btn-ghost btn-icon"
          onClick={handleDelete}
          title="Delete field (Delete)"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
