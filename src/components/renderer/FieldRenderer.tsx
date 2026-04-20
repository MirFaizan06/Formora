import type { FormField } from '../../types/form.types'

interface FieldRendererProps {
  field: FormField
  value: string | boolean | string[]
  onChange: (value: string | boolean | string[]) => void
  error?: string
}

function widthToColSpan(w: string): number {
  if (w === 'half') return 6
  if (w === 'third') return 4
  if (w === 'quarter') return 3
  return 12
}

export default function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  if (field.type === 'form-header') {
    return (
      <div className={`renderer-field renderer-field--full renderer-field--header`} style={{ gridColumn: 'span 12' }}>
        <h2 className="renderer-header__title">{field.label}</h2>
        {field.metadata && <p className="renderer-header__subtitle">{field.metadata}</p>}
      </div>
    )
  }

  if (field.type === 'divider') {
    return <hr className="renderer-divider" style={{ gridColumn: 'span 12' }} />
  }

  if (field.type === 'label') {
    return (
      <div
        className="renderer-field renderer-field--label"
        style={{ gridColumn: `span ${field.gridColSpan ?? 12}` }}
      >
        <p>{field.label}</p>
      </div>
    )
  }

  if (field.type === 'rating') {
    const stars = field.maxRating ?? 5
    const numVal = Number(value) || 0
    return (
      <div
        className={`renderer-field renderer-field--${field.width}`}
        style={{ gridColumn: `span ${field.gridColSpan ?? widthToColSpan(field.width)}` }}
      >
        <label className="renderer-field__label">
          {field.label}
          {field.required && <span className="renderer-field__required"> *</span>}
        </label>
        <div className="rating-field">
          {Array.from({ length: stars }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`rating-star${i < numVal ? ' rating-star--active' : ''}`}
              onClick={() => onChange(String(i + 1))}
            >★</button>
          ))}
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    )
  }

  if (field.type === 'checkbox-group') {
    const selected = Array.isArray(value) ? value : (value ? [String(value)] : [])
    return (
      <div
        className={`renderer-field renderer-field--${field.width}`}
        style={{ gridColumn: `span ${field.gridColSpan ?? widthToColSpan(field.width)}` }}
      >
        <label className="renderer-field__label">
          {field.label}
          {field.required && <span className="renderer-field__required"> *</span>}
        </label>
        <div className="checkbox-group-field">
          {(field.options ?? []).map((opt) => (
            <label key={opt.value} className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...selected, opt.value]
                    : selected.filter((v) => v !== opt.value)
                  onChange(next)
                }}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    )
  }

  if (field.type === 'address') {
    const addr = (() => { try { return JSON.parse(String(value ?? '{}')) } catch { return {} } })()
    const update = (key: string, v: string) => onChange(JSON.stringify({ ...addr, [key]: v }))
    return (
      <div
        className={`renderer-field renderer-field--${field.width}`}
        style={{ gridColumn: `span ${field.gridColSpan ?? widthToColSpan(field.width)}` }}
      >
        <label className="renderer-field__label">
          {field.label}
          {field.required && <span className="renderer-field__required"> *</span>}
        </label>
        <div className="address-field">
          <input className="input" placeholder="Street Address" value={addr.street ?? ''} onChange={(e) => update('street', e.target.value)} />
          <div className="address-field__row">
            <input className="input" placeholder="City" value={addr.city ?? ''} onChange={(e) => update('city', e.target.value)} />
            <input className="input" style={{ width: 80 }} placeholder="State" value={addr.state ?? ''} onChange={(e) => update('state', e.target.value)} />
            <input className="input" style={{ width: 90 }} placeholder="ZIP" value={addr.zip ?? ''} onChange={(e) => update('zip', e.target.value)} />
          </div>
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    )
  }

  if (field.type === 'fill-blank') {
    const template = field.metadata ?? '___'
    const parts = template.split('___')
    const values = Array.isArray(value) ? value : []
    const updatePart = (i: number, v: string) => {
      const next = [...values]
      next[i] = v
      onChange(next)
    }
    return (
      <div
        className={`renderer-field renderer-field--${field.width}`}
        style={{ gridColumn: `span ${field.gridColSpan ?? widthToColSpan(field.width)}` }}
      >
        <label className="renderer-field__label">
          {field.label}
          {field.required && <span className="renderer-field__required"> *</span>}
        </label>
        <div className="fillblank-field">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <input
                  className="fillblank-input"
                  value={values[i] ?? ''}
                  onChange={(e) => updatePart(i, e.target.value)}
                  size={Math.max(10, (values[i]?.length ?? 0) + 2)}
                />
              )}
            </span>
          ))}
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    )
  }

  if (field.type === 'table') {
    const cols = field.tableColumns ?? ['Column 1', 'Column 2', 'Column 3']
    const rows = field.tableRows ?? 3
    const tableData: string[][] = (() => { try { return JSON.parse(String(value ?? '[]')) } catch { return [] } })()
    const getCell = (r: number, c: number) => tableData[r]?.[c] ?? ''
    const setCell = (r: number, c: number, v: string) => {
      const next: string[][] = Array.from({ length: rows }, (_, ri) =>
        Array.from({ length: cols.length }, (_, ci) => tableData[ri]?.[ci] ?? '')
      )
      next[r][c] = v
      onChange(JSON.stringify(next))
    }
    return (
      <div
        className={`renderer-field renderer-field--${field.width}`}
        style={{ gridColumn: `span ${field.gridColSpan ?? widthToColSpan(field.width)}` }}
      >
        <label className="renderer-field__label">
          {field.label}
          {field.required && <span className="renderer-field__required"> *</span>}
        </label>
        <div className="table-field">
          <table>
            <thead><tr>{cols.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
            <tbody>
              {Array.from({ length: rows }).map((_, ri) => (
                <tr key={ri}>
                  {cols.map((_, ci) => (
                    <td key={ci}>
                      <input className="table-cell-input" value={getCell(ri, ci)} onChange={(e) => setCell(ri, ci, e.target.value)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    )
  }

  return (
    <div
      className={`renderer-field renderer-field--${field.width}`}
      style={{ gridColumn: `span ${field.gridColSpan ?? widthToColSpan(field.width)}` }}
    >
      <label className="renderer-field__label">
        {field.label}
        {field.required && <span className="renderer-field__required"> *</span>}
      </label>

      {field.type === 'text' && (
        <input
          className={`input${error ? ' input--error' : ''}`}
          type="text"
          placeholder={field.placeholder}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          className={`input textarea${error ? ' input--error' : ''}`}
          placeholder={field.placeholder}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      )}

      {field.type === 'number' && (
        <input
          className={`input${error ? ' input--error' : ''}`}
          type="number"
          placeholder={field.placeholder}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          min={field.validation?.min}
          max={field.validation?.max}
        />
      )}

      {field.type === 'date' && (
        <input
          className={`input${error ? ' input--error' : ''}`}
          type="date"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'time' && (
        <input
          className={`input${error ? ' input--error' : ''}`}
          type="time"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'email' && (
        <input
          className={`input${error ? ' input--error' : ''}`}
          type="email"
          placeholder={field.placeholder ?? 'email@example.com'}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'phone' && (
        <input
          className={`input${error ? ' input--error' : ''}`}
          type="tel"
          placeholder={field.placeholder ?? '(555) 000-0000'}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'checkbox' && (
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{field.placeholder || field.label}</span>
        </label>
      )}

      {field.type === 'radio' && (
        <div className="radio-group">
          {(field.options ?? []).map((opt) => (
            <label key={opt.value} className="radio-wrapper">
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'dropdown' && (
        <select
          className={`select-field${error ? ' input--error' : ''}`}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.type === 'signature' && (
        <div className="signature-field">
          <canvas className="signature-canvas" width={300} height={80} />
          <p className="signature-hint">Signature area</p>
        </div>
      )}

      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
