import { type SelectHTMLAttributes, forwardRef } from 'react'

interface Option {
  label: string
  value: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="input-group">
        {label && <label className="input-label" htmlFor={selectId}>{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={`select-field${error ? ' input--error' : ''} ${className}`}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <span className="input-error">{error}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select
