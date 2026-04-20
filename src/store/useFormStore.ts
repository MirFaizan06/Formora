import { create } from 'zustand'
import { Form, FormField, FormPage } from '../types/form.types'
import { createEmptyPage } from '../utils/formSchema'
import { generateId } from '../utils/generateId'

interface FormStore {
  forms: Form[]
  activeFormId: string | null
  activePageIndex: number
  selectedFieldId: string | null

  setForms(forms: Form[]): void
  addForm(form: Form): void
  updateForm(id: string, updates: Partial<Form>): void
  deleteForm(id: string): void
  duplicateForm(id: string): void
  setActiveForm(id: string | null): void

  addPage(formId: string): void
  updatePage(formId: string, pageId: string, updates: Partial<FormPage>): void
  deletePage(formId: string, pageId: string): void
  setActivePageIndex(index: number): void

  addField(formId: string, pageId: string, field: FormField): void
  updateField(formId: string, pageId: string, fieldId: string, updates: Partial<FormField>): void
  deleteField(formId: string, pageId: string, fieldId: string): void
  duplicateField(formId: string, pageId: string, fieldId: string): void
  reorderFields(formId: string, pageId: string, fromIndex: number, toIndex: number): void
  setSelectedField(id: string | null): void

  getActiveForm(): Form | null
  getActivePage(): FormPage | null
}

function touchForm(form: Form): Form {
  return { ...form, updatedAt: new Date().toISOString() }
}

export const useFormStore = create<FormStore>((set, get) => ({
  forms: [],
  activeFormId: null,
  activePageIndex: 0,
  selectedFieldId: null,

  setForms: (forms) => set({ forms }),

  addForm: (form) => set((state) => ({ forms: [...state.forms, form] })),

  updateForm: (id, updates) =>
    set((state) => ({
      forms: state.forms.map((f) =>
        f.id === id ? touchForm({ ...f, ...updates }) : f
      ),
    })),

  deleteForm: (id) =>
    set((state) => ({
      forms: state.forms.filter((f) => f.id !== id),
      activeFormId: state.activeFormId === id ? null : state.activeFormId,
    })),

  duplicateForm: (id) => {
    const original = get().forms.find((f) => f.id === id)
    if (!original) return
    const now = new Date().toISOString()
    const copy: Form = {
      ...JSON.parse(JSON.stringify(original)),
      id: generateId(),
      title: `${original.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({ forms: [...state.forms, copy] }))
  },

  setActiveForm: (id) => set({ activeFormId: id, activePageIndex: 0, selectedFieldId: null }),

  addPage: (formId) =>
    set((state) => ({
      forms: state.forms.map((f) => {
        if (f.id !== formId) return f
        const newPage = createEmptyPage()
        newPage.title = `Page ${f.pages.length + 1}`
        newPage.order = f.pages.length
        return touchForm({ ...f, pages: [...f.pages, newPage] })
      }),
    })),

  updatePage: (formId, pageId, updates) =>
    set((state) => ({
      forms: state.forms.map((f) => {
        if (f.id !== formId) return f
        return touchForm({
          ...f,
          pages: f.pages.map((p) => (p.id === pageId ? { ...p, ...updates } : p)),
        })
      }),
    })),

  deletePage: (formId, pageId) =>
    set((state) => ({
      forms: state.forms.map((f) => {
        if (f.id !== formId) return f
        if (f.pages.length <= 1) return f
        return touchForm({
          ...f,
          pages: f.pages
            .filter((p) => p.id !== pageId)
            .map((p, i) => ({ ...p, order: i })),
        })
      }),
      activePageIndex: 0,
    })),

  setActivePageIndex: (index) => set({ activePageIndex: index }),

  addField: (formId, pageId, field) =>
    set((state) => ({
      selectedFieldId: field.id,
      forms: state.forms.map((f) => {
        if (f.id !== formId) return f
        return touchForm({
          ...f,
          pages: f.pages.map((p) => {
            if (p.id !== pageId) return p
            const order = p.fields.length
            return { ...p, fields: [...p.fields, { ...field, order }] }
          }),
        })
      }),
    })),

  updateField: (formId, pageId, fieldId, updates) =>
    set((state) => ({
      forms: state.forms.map((f) => {
        if (f.id !== formId) return f
        return touchForm({
          ...f,
          pages: f.pages.map((p) => {
            if (p.id !== pageId) return p
            return {
              ...p,
              fields: p.fields.map((field) =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            }
          }),
        })
      }),
    })),

  deleteField: (formId, pageId, fieldId) =>
    set((state) => ({
      forms: state.forms.map((f) => {
        if (f.id !== formId) return f
        return touchForm({
          ...f,
          pages: f.pages.map((p) => {
            if (p.id !== pageId) return p
            return {
              ...p,
              fields: p.fields
                .filter((field) => field.id !== fieldId)
                .map((field, i) => ({ ...field, order: i })),
            }
          }),
        })
      }),
      selectedFieldId:
        get().selectedFieldId === fieldId ? null : get().selectedFieldId,
    })),

  duplicateField: (formId, pageId, fieldId) => {
    const page = get().forms.find((f) => f.id === formId)?.pages.find((p) => p.id === pageId)
    if (!page) return
    const original = page.fields.find((f) => f.id === fieldId)
    if (!original) return
    const copy = { ...JSON.parse(JSON.stringify(original)), id: generateId(), order: page.fields.length }
    set((state) => ({
      selectedFieldId: copy.id,
      forms: state.forms.map((f) => {
        if (f.id !== formId) return f
        return touchForm({
          ...f,
          pages: f.pages.map((p) => {
            if (p.id !== pageId) return p
            return { ...p, fields: [...p.fields, copy] }
          }),
        })
      }),
    }))
  },

  reorderFields: (formId, pageId, fromIndex, toIndex) =>
    set((state) => ({
      forms: state.forms.map((f) => {
        if (f.id !== formId) return f
        return touchForm({
          ...f,
          pages: f.pages.map((p) => {
            if (p.id !== pageId) return p
            const fields = [...p.fields]
            const [moved] = fields.splice(fromIndex, 1)
            fields.splice(toIndex, 0, moved)
            return {
              ...p,
              fields: fields.map((field, i) => ({ ...field, order: i })),
            }
          }),
        })
      }),
    })),

  setSelectedField: (id) => set({ selectedFieldId: id }),

  getActiveForm: () => {
    const { forms, activeFormId } = get()
    return forms.find((f) => f.id === activeFormId) ?? null
  },

  getActivePage: () => {
    const { activePageIndex } = get()
    const form = get().getActiveForm()
    if (!form) return null
    return form.pages[activePageIndex] ?? null
  },
}))
