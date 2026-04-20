export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'time'
  | 'email'
  | 'phone'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio'
  | 'dropdown'
  | 'rating'
  | 'signature'
  | 'address'
  | 'fill-blank'
  | 'form-header'
  | 'divider'
  | 'table'
  | 'label'

export interface FieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: FieldOption[]
  value?: string | boolean | string[]
  width: 'full' | 'half' | 'third' | 'quarter'
  gridColSpan?: number        // 1–12 column span; derived from width if absent
  order: number
  section?: string
  metadata?: string           // form-header subtitle; fill-blank sentence template
  maxRating?: number          // rating field max stars (default 5)
  tableColumns?: string[]     // table field column headers
  tableRows?: number          // table field initial row count (default 3)
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
}

export interface FormPage {
  id: string
  title: string
  fields: FormField[]
  order: number
}

export interface Form {
  id: string
  title: string
  description?: string
  pages: FormPage[]
  createdAt: string
  updatedAt: string
  settings: {
    paperSize: 'A4' | 'Letter'
    orientation: 'portrait' | 'landscape'
    showPageNumbers: boolean
    primaryColor: string
  }
}

export type AppView = 'explorer' | 'builder' | 'settings' | 'templates'

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: 'business' | 'hr' | 'healthcare' | 'education' | 'events' | 'surveys' | 'general'
  fieldCount: number
  pages: Omit<FormPage, 'id'>[]   // ids will be regenerated on load
  settings: Form['settings']
}
