import { useState } from 'react'
import type { Form, FormField } from '../../types/form.types'
import FieldRenderer from './FieldRenderer'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

interface FormRendererProps {
  form: Form
  onSubmit?: (values: Record<string, string | boolean | string[]>) => void
}

function validateField(field: FormField, value: string | boolean | string[]): string | null {
  if (field.required && (value === '' || value === undefined || value === null || value === false)) {
    return `${field.label} is required`
  }
  if (field.type === 'text' || field.type === 'textarea') {
    const str = String(value)
    if (field.validation?.minLength && str.length < field.validation.minLength) {
      return `Minimum ${field.validation.minLength} characters`
    }
    if (field.validation?.maxLength && str.length > field.validation.maxLength) {
      return `Maximum ${field.validation.maxLength} characters`
    }
  }
  if (field.required) {
    if (field.type === 'rating' && (value === '' || value === '0' || Number(value) === 0)) {
      return `${field.label} is required`
    }
    if (field.type === 'checkbox-group' && (!Array.isArray(value) || value.length === 0)) {
      return `${field.label}: please select at least one option`
    }
    if (field.type === 'address') {
      try {
        const addr = JSON.parse(String(value ?? '{}'))
        if (!addr.street) return `${field.label}: street address is required`
      } catch { return `${field.label} is required` }
    }
  }
  return null
}

export default function FormRenderer({ form, onSubmit }: FormRendererProps) {
  const [values, setValues] = useState<Record<string, string | boolean | string[]>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pageIndex, setPageIndex] = useState(0)

  const page = form.pages[pageIndex]
  if (!page) return null

  const sortedFields = [...page.fields].sort((a, b) => a.order - b.order)

  function handleChange(fieldId: string, value: string | boolean | string[]) {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
    setErrors((prev) => ({ ...prev, [fieldId]: '' }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    let valid = true
    for (const field of sortedFields) {
      const err = validateField(field, values[field.id] ?? '')
      if (err) { newErrors[field.id] = err; valid = false }
    }
    setErrors(newErrors)
    return valid
  }

  function handleNext() {
    if (!validate()) return
    if (pageIndex < form.pages.length - 1) setPageIndex((p) => p + 1)
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit?.(values)
    toast.success('Form submitted!')
  }

  const isLastPage = pageIndex === form.pages.length - 1

  return (
    <div className="form-renderer">
      <div className="form-renderer__header">
        <h1 className="form-renderer__title">{form.title}</h1>
        {form.description && <p className="form-renderer__desc">{form.description}</p>}
        {form.pages.length > 1 && (
          <p className="form-renderer__page">Page {pageIndex + 1} of {form.pages.length}</p>
        )}
      </div>

      <div className="form-renderer__fields" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '12px', alignItems: 'start' }}>
        {sortedFields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[field.id] ?? ''}
            onChange={(v) => handleChange(field.id, v)}
            error={errors[field.id]}
          />
        ))}
      </div>

      <div className="form-renderer__footer">
        {pageIndex > 0 && (
          <Button variant="secondary" onClick={() => setPageIndex((p) => p - 1)}>
            Previous
          </Button>
        )}
        {isLastPage ? (
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>Next Page</Button>
        )}
      </div>
    </div>
  )
}
