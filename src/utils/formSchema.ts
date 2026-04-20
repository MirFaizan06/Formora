import { Form, FormField, FormPage, FieldType } from '../types/form.types'
import { generateId } from './generateId'

export function widthToColSpan(width: FormField['width']): number {
  switch (width) {
    case 'half':    return 6
    case 'third':   return 4
    case 'quarter': return 3
    default:        return 12
  }
}

export function colSpanToWidth(span: number): FormField['width'] {
  if (span <= 3)  return 'quarter'
  if (span <= 4)  return 'third'
  if (span <= 6)  return 'half'
  return 'full'
}

export function getFieldColSpan(field: FormField): number {
  if (field.gridColSpan != null) return field.gridColSpan
  return widthToColSpan(field.width)
}

const LABEL_MAP: Partial<Record<FieldType, string>> = {
  text: 'Text Field',
  textarea: 'Text Area',
  number: 'Number',
  date: 'Date',
  time: 'Time',
  email: 'Email Address',
  phone: 'Phone Number',
  checkbox: 'Checkbox',
  'checkbox-group': 'Checkbox Group',
  radio: 'Radio Group',
  dropdown: 'Dropdown',
  rating: 'Rating',
  signature: 'Signature',
  address: 'Address',
  'fill-blank': 'Fill in the Blank',
  'form-header': 'Section Header',
  divider: 'Divider',
  table: 'Table',
  label: 'Label Text',
}

export function createEmptyField(type: FieldType): FormField {
  const base: FormField = {
    id: generateId(),
    type,
    label: LABEL_MAP[type] ?? type,
    required: false,
    width: 'full',
    order: 0,
  }

  // grid span overrides
  if (type === 'form-header' || type === 'divider' || type === 'address' || type === 'table') {
    base.gridColSpan = 12
  }

  // placeholders
  if (['text', 'textarea', 'number', 'date', 'time'].includes(type)) {
    base.placeholder = ''
  }
  if (type === 'email')   base.placeholder = 'email@example.com'
  if (type === 'phone')   base.placeholder = '(555) 000-0000'

  // options
  if (type === 'radio' || type === 'dropdown' || type === 'checkbox-group') {
    base.options = [
      { label: 'Option 1', value: 'option_1' },
      { label: 'Option 2', value: 'option_2' },
      { label: 'Option 3', value: 'option_3' },
    ]
  }

  // type-specific defaults
  if (type === 'rating')      base.maxRating = 5
  if (type === 'fill-blank')  base.metadata = 'My name is ___ and I work as a ___.'
  if (type === 'form-header') base.metadata = 'Section subtitle or description'
  if (type === 'table') {
    base.tableColumns = ['Column 1', 'Column 2', 'Column 3']
    base.tableRows = 3
  }

  // email validation
  if (type === 'email') {
    base.validation = { pattern: '^[^@]+@[^@]+\\.[^@]+$' }
  }

  return base
}

export function createEmptyPage(): FormPage {
  return {
    id: generateId(),
    title: 'Page 1',
    fields: [],
    order: 0,
  }
}

export function createEmptyForm(): Form {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: 'Untitled Form',
    description: '',
    pages: [createEmptyPage()],
    createdAt: now,
    updatedAt: now,
    settings: {
      paperSize: 'A4',
      orientation: 'portrait',
      showPageNumbers: true,
      primaryColor: '#7c6af7',
    },
  }
}
