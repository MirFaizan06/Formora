import { useFormStore } from '../../store/useFormStore'
import Input from '../ui/Input'
import Select from '../ui/Select'
import FormSettings from './FormSettings'
import type { FormField } from '../../types/form.types'
import { widthToColSpan } from '../../utils/formSchema'

const WIDTH_OPTIONS = [
  { label: 'Full Width', value: 'full' },
  { label: 'Half Width', value: 'half' },
  { label: 'One Third',  value: 'third' },
  { label: 'One Quarter', value: 'quarter' },
]

export default function PropertiesPanel() {
  const selectedFieldId = useFormStore((s) => s.selectedFieldId)
  const getActiveForm = useFormStore((s) => s.getActiveForm)
  const getActivePage = useFormStore((s) => s.getActivePage)
  const updateField = useFormStore((s) => s.updateField)

  const form = getActiveForm()
  const page = getActivePage()
  const field = page?.fields.find((f) => f.id === selectedFieldId) ?? null

  if (!form) {
    return (
      <div className="properties-panel properties-panel--empty">
        <p>Open a form from the Explorer to start building.</p>
      </div>
    )
  }

  if (!field || !page) {
    return (
      <div className="properties-panel">
        <FormSettings />
      </div>
    )
  }

  function update(updates: Partial<FormField>) {
    if (!form || !page || !field) return
    updateField(form.id, page.id, field.id, updates)
  }

  return (
    <div className="properties-panel">
      <div className="properties-panel__header">
        <span>Field Properties</span>
        <span className="properties-panel__type">{field.type}</span>
      </div>

      <div className="properties-panel__body">
        {/* Label */}
        <Input
          label="Label"
          value={field.label}
          onChange={(e) => update({ label: e.target.value })}
        />

        {/* Placeholder */}
        {field.type !== 'label' && field.type !== 'checkbox' && field.type !== 'signature'
          && field.type !== 'form-header' && field.type !== 'divider' && field.type !== 'rating'
          && field.type !== 'address' && field.type !== 'table' && field.type !== 'fill-blank'
          && field.type !== 'radio' && field.type !== 'checkbox-group' && field.type !== 'dropdown' && (
          <Input
            label="Placeholder"
            value={field.placeholder ?? ''}
            onChange={(e) => update({ placeholder: e.target.value })}
          />
        )}

        {/* Width preset */}
        <Select
          label="Width"
          value={field.width}
          options={WIDTH_OPTIONS}
          onChange={(e) => update({ width: e.target.value as FormField['width'] })}
        />

        {/* Column Span control */}
        <div className="input-group">
          <label className="input-label">Column Span (1–12)</label>
          <div className="prop-span-presets">
            {[3, 4, 6, 9, 12].map((n) => (
              <button
                key={n}
                className={`prop-span-btn${(field.gridColSpan ?? widthToColSpan(field.width)) === n ? ' prop-span-btn--active' : ''}`}
                onClick={() => update({ gridColSpan: n })}
              >
                {n === 12 ? 'Full' : n === 6 ? 'Half' : n === 4 ? '1/3' : n === 3 ? '1/4' : n}
              </button>
            ))}
          </div>
          <input
            type="number"
            className="input"
            min={1}
            max={12}
            value={field.gridColSpan ?? widthToColSpan(field.width)}
            onChange={(e) => update({ gridColSpan: Math.min(12, Math.max(1, Number(e.target.value))) })}
            style={{ marginTop: 6 }}
          />
        </div>

        {/* Required */}
        {field.type !== 'label' && field.type !== 'form-header' && field.type !== 'divider' && (
          <div className="input-group">
            <label className="input-label">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => update({ required: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              Required field
            </label>
          </div>
        )}

        {/* Options for radio, dropdown, checkbox-group */}
        {(field.type === 'radio' || field.type === 'dropdown' || field.type === 'checkbox-group') && (
          <div className="input-group">
            <label className="input-label">Options (one per line)</label>
            <textarea
              className="input textarea"
              rows={4}
              value={(field.options ?? []).map((o) => o.label).join('\n')}
              onChange={(e) => {
                const opts = e.target.value.split('\n').filter(Boolean).map((l) => ({
                  label: l.trim(),
                  value: l.trim().toLowerCase().replace(/\s+/g, '-'),
                }))
                update({ options: opts })
              }}
            />
          </div>
        )}

        {/* Form header subtitle */}
        {field.type === 'form-header' && (
          <Input
            label="Subtitle / Description"
            value={field.metadata ?? ''}
            onChange={(e) => update({ metadata: e.target.value })}
          />
        )}

        {/* Fill-in-blank template */}
        {field.type === 'fill-blank' && (
          <div className="input-group">
            <label className="input-label">Sentence Template (use ___ for blanks)</label>
            <textarea
              className="input textarea"
              rows={3}
              value={field.metadata ?? ''}
              onChange={(e) => update({ metadata: e.target.value })}
            />
          </div>
        )}

        {/* Rating max stars */}
        {field.type === 'rating' && (
          <Input
            label="Max Stars"
            type="number"
            value={field.maxRating ?? 5}
            onChange={(e) => update({ maxRating: Math.min(10, Math.max(1, Number(e.target.value))) })}
          />
        )}

        {/* Table columns + rows */}
        {field.type === 'table' && (
          <>
            <div className="input-group">
              <label className="input-label">Column Headers (one per line)</label>
              <textarea
                className="input textarea"
                rows={3}
                value={(field.tableColumns ?? []).join('\n')}
                onChange={(e) => update({ tableColumns: e.target.value.split('\n').filter(Boolean) })}
              />
            </div>
            <Input
              label="Number of Rows"
              type="number"
              value={field.tableRows ?? 3}
              onChange={(e) => update({ tableRows: Math.min(20, Math.max(1, Number(e.target.value))) })}
            />
          </>
        )}

        {/* Text/Textarea validation */}
        {(field.type === 'text' || field.type === 'textarea') && (
          <>
            <Input
              label="Min Length"
              type="number"
              value={field.validation?.minLength ?? ''}
              onChange={(e) => update({ validation: { ...field.validation, minLength: Number(e.target.value) || undefined } })}
            />
            <Input
              label="Max Length"
              type="number"
              value={field.validation?.maxLength ?? ''}
              onChange={(e) => update({ validation: { ...field.validation, maxLength: Number(e.target.value) || undefined } })}
            />
          </>
        )}

        {/* Number validation */}
        {field.type === 'number' && (
          <>
            <Input
              label="Min Value"
              type="number"
              value={field.validation?.min ?? ''}
              onChange={(e) => update({ validation: { ...field.validation, min: Number(e.target.value) || undefined } })}
            />
            <Input
              label="Max Value"
              type="number"
              value={field.validation?.max ?? ''}
              onChange={(e) => update({ validation: { ...field.validation, max: Number(e.target.value) || undefined } })}
            />
          </>
        )}
      </div>
    </div>
  )
}
