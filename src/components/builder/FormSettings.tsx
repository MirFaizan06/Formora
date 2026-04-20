import { useFormStore } from '../../store/useFormStore'
import Input from '../ui/Input'
import Select from '../ui/Select'
import type { Form } from '../../types/form.types'

const PAPER_SIZE_OPTIONS = [
  { label: 'A4', value: 'A4' },
  { label: 'Letter', value: 'Letter' },
]

const ORIENTATION_OPTIONS = [
  { label: 'Portrait', value: 'portrait' },
  { label: 'Landscape', value: 'landscape' },
]

export default function FormSettings() {
  const getActiveForm = useFormStore((s) => s.getActiveForm)
  const updateForm = useFormStore((s) => s.updateForm)

  const form = getActiveForm()
  if (!form) return null

  function updateMeta(updates: Partial<Pick<Form, 'title' | 'description'>>) {
    if (!form) return
    updateForm(form.id, updates)
  }

  function updateSettings(updates: Partial<Form['settings']>) {
    if (!form) return
    updateForm(form.id, { settings: { ...form.settings, ...updates } })
  }

  return (
    <div className="form-settings">
      <div className="properties-panel__header">
        <span>Form Settings</span>
        <span className="properties-panel__type">form</span>
      </div>

      <div className="properties-panel__body">
        <Input
          label="Form Title"
          value={form.title}
          onChange={(e) => updateMeta({ title: e.target.value })}
        />

        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea
            className="input textarea"
            rows={3}
            value={form.description ?? ''}
            placeholder="Optional form description…"
            onChange={(e) => updateMeta({ description: e.target.value })}
          />
        </div>

        <Select
          label="Paper Size"
          value={form.settings.paperSize}
          options={PAPER_SIZE_OPTIONS}
          onChange={(e) =>
            updateSettings({ paperSize: e.target.value as Form['settings']['paperSize'] })
          }
        />

        <Select
          label="Orientation"
          value={form.settings.orientation}
          options={ORIENTATION_OPTIONS}
          onChange={(e) =>
            updateSettings({ orientation: e.target.value as Form['settings']['orientation'] })
          }
        />

        <div className="input-group">
          <label className="input-label">
            <input
              type="checkbox"
              checked={form.settings.showPageNumbers}
              onChange={(e) => updateSettings({ showPageNumbers: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            Show page numbers
          </label>
        </div>

        <div className="input-group">
          <label className="input-label">Primary Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="color"
              className="input-color"
              value={form.settings.primaryColor}
              onChange={(e) => updateSettings({ primaryColor: e.target.value })}
            />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {form.settings.primaryColor}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
