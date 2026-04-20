import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib'
import { Form, FormField } from '../../types/form.types'

// Page dimensions
const A4_W = 595.28, A4_H = 841.89
const LT_W = 612, LT_H = 792
const MARGIN = 48
const LABEL_FS = 9
const FIELD_H = 24
const HEADER_H = 32
const ROW_GAP = 14
const COL_GAP = 8

function hexToRgb(hex: string) {
  const c = hex.replace('#', '')
  const n = parseInt(c, 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}

function getColSpan(f: FormField): number {
  if (f.gridColSpan != null) return f.gridColSpan
  if (f.width === 'half') return 6
  if (f.width === 'third') return 4
  if (f.width === 'quarter') return 3
  return 12
}

// Group fields into rows such that colSpans in a row sum <= 12
function groupIntoRows(fields: FormField[]): FormField[][] {
  const rows: FormField[][] = []
  let row: FormField[] = []
  let rowSpan = 0
  for (const f of fields) {
    const span = getColSpan(f)
    // structural full-width fields always start their own row
    if (['form-header', 'divider', 'label', 'address', 'fill-blank', 'table'].includes(f.type)) {
      if (row.length > 0) { rows.push(row); row = []; rowSpan = 0 }
      rows.push([f])
      continue
    }
    if (rowSpan + span > 12) {
      if (row.length > 0) rows.push(row)
      row = []; rowSpan = 0
    }
    row.push(f)
    rowSpan += span
  }
  if (row.length > 0) rows.push(row)
  return rows
}

function clampText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string {
  if (font.widthOfTextAtSize(text, fontSize) <= maxWidth) return text
  let t = text
  while (t.length > 0 && font.widthOfTextAtSize(t + '…', fontSize) > maxWidth) t = t.slice(0, -1)
  return t + '…'
}

interface Ctx {
  page: PDFPage
  bold: PDFFont
  regular: PDFFont
  accent: ReturnType<typeof rgb>
  black: ReturnType<typeof rgb>
  gray: ReturnType<typeof rgb>
  lightGray: ReturnType<typeof rgb>
  white: ReturnType<typeof rgb>
  pageW: number
  pageH: number
  contentW: number
}

function fieldHeight(f: FormField): number {
  if (f.type === 'form-header') return HEADER_H + 10
  if (f.type === 'divider') return 16
  if (f.type === 'label') return LABEL_FS + 8
  if (f.type === 'textarea') return FIELD_H * 2 + LABEL_FS + 4
  if (f.type === 'address') return (LABEL_FS + 4) + FIELD_H + 6 + FIELD_H + ROW_GAP
  if (f.type === 'table') {
    const rows = f.tableRows ?? 3
    return (LABEL_FS + 4) + 18 + rows * 18 + ROW_GAP
  }
  if (f.type === 'radio' || f.type === 'checkbox-group') {
    const opts = f.options?.length ?? 2
    return (LABEL_FS + 4) + opts * 16 + ROW_GAP
  }
  if (f.type === 'rating') return (LABEL_FS + 4) + 18 + ROW_GAP
  if (f.type === 'fill-blank') return (LABEL_FS + 4) + FIELD_H + ROW_GAP
  return (LABEL_FS + 4) + FIELD_H + ROW_GAP
}

function drawField(f: FormField, x: number, y: number, w: number, ctx: Ctx): number {
  const { page, bold, regular, accent, black, gray, lightGray, white } = ctx

  // form-header — section heading with left accent bar
  if (f.type === 'form-header') {
    page.drawRectangle({ x, y: y - HEADER_H + 4, width: 3, height: HEADER_H, color: accent })
    page.drawText(f.label, { x: x + 10, y: y - 14, size: 13, font: bold, color: black })
    if (f.metadata) {
      page.drawText(clampText(f.metadata, regular, LABEL_FS, w - 16), {
        x: x + 10, y: y - 26, size: LABEL_FS, font: regular, color: gray,
      })
    }
    page.drawLine({ start: { x, y: y - HEADER_H + 2 }, end: { x: x + w, y: y - HEADER_H + 2 }, thickness: 0.5, color: lightGray })
    return fieldHeight(f)
  }

  // divider — horizontal rule
  if (f.type === 'divider') {
    page.drawLine({ start: { x, y: y - 8 }, end: { x: x + w, y: y - 8 }, thickness: 0.75, color: lightGray })
    return fieldHeight(f)
  }

  // label — plain text
  if (f.type === 'label') {
    page.drawText(clampText(f.label, regular, LABEL_FS, w), { x, y, size: LABEL_FS, font: regular, color: gray })
    return fieldHeight(f)
  }

  // Draw label for all other types
  const labelText = f.required ? `${f.label} *` : f.label
  page.drawText(clampText(labelText, f.required ? bold : regular, LABEL_FS, w), {
    x, y, size: LABEL_FS, font: f.required ? bold : regular, color: black,
  })
  const inputY = y - LABEL_FS - 4

  // textarea
  if (f.type === 'textarea') {
    page.drawRectangle({ x, y: inputY - FIELD_H, width: w, height: FIELD_H * 2, borderColor: gray, borderWidth: 0.75, color: white })
    return fieldHeight(f)
  }

  // checkbox (single)
  if (f.type === 'checkbox') {
    page.drawRectangle({ x, y: inputY - 12, width: 12, height: 12, borderColor: gray, borderWidth: 0.75, color: white })
    if (f.placeholder || f.label) {
      page.drawText(clampText(f.placeholder || f.label, regular, LABEL_FS, w - 20), { x: x + 18, y: inputY - 10, size: LABEL_FS, font: regular, color: black })
    }
    return fieldHeight(f)
  }

  // checkbox-group
  if (f.type === 'checkbox-group') {
    let oy = inputY
    for (const opt of (f.options ?? [])) {
      page.drawRectangle({ x, y: oy - 10, width: 10, height: 10, borderColor: gray, borderWidth: 0.75, color: white })
      page.drawText(clampText(opt.label, regular, LABEL_FS, w - 18), { x: x + 15, y: oy - 9, size: LABEL_FS, font: regular, color: black })
      oy -= 16
    }
    return fieldHeight(f)
  }

  // radio
  if (f.type === 'radio') {
    let oy = inputY
    for (const opt of (f.options ?? [])) {
      page.drawCircle({ x: x + 5, y: oy - 5, size: 5, borderColor: gray, borderWidth: 0.75, color: white })
      page.drawText(clampText(opt.label, regular, LABEL_FS, w - 18), { x: x + 14, y: oy - 9, size: LABEL_FS, font: regular, color: black })
      oy -= 16
    }
    return fieldHeight(f)
  }

  // dropdown
  if (f.type === 'dropdown') {
    page.drawRectangle({ x, y: inputY - FIELD_H, width: w, height: FIELD_H, borderColor: gray, borderWidth: 0.75, color: white })
    page.drawText('▼', { x: x + w - 14, y: inputY - FIELD_H + 8, size: 8, font: regular, color: gray })
    if ((f.options ?? []).length > 0) {
      page.drawText(clampText(f.options![0].label, regular, LABEL_FS, w - 20), { x: x + 6, y: inputY - FIELD_H + 8, size: LABEL_FS, font: regular, color: lightGray })
    }
    return fieldHeight(f)
  }

  // signature
  if (f.type === 'signature') {
    page.drawRectangle({ x, y: inputY - FIELD_H, width: w, height: FIELD_H, borderColor: gray, borderWidth: 0.75, color: white })
    page.drawText('✕  Signature', { x: x + 8, y: inputY - FIELD_H + 8, size: LABEL_FS, font: regular, color: gray })
    return fieldHeight(f)
  }

  // rating — stars
  if (f.type === 'rating') {
    const stars = f.maxRating ?? 5
    let sx = x
    for (let i = 0; i < stars; i++) {
      page.drawText('☆', { x: sx, y: inputY - 14, size: 14, font: regular, color: gray })
      sx += 16
    }
    return fieldHeight(f)
  }

  // address — street + city/state/zip
  if (f.type === 'address') {
    // Street
    page.drawRectangle({ x, y: inputY - FIELD_H, width: w, height: FIELD_H, borderColor: gray, borderWidth: 0.75, color: white })
    page.drawText('Street Address', { x: x + 6, y: inputY - FIELD_H + 8, size: 8, font: regular, color: lightGray })
    // City / State / ZIP on next row
    const cityW = w * 0.5 - COL_GAP
    const stateW = w * 0.25 - COL_GAP
    const zipW = w * 0.25
    const row2Y = inputY - FIELD_H - 6
    page.drawRectangle({ x, y: row2Y - FIELD_H, width: cityW, height: FIELD_H, borderColor: gray, borderWidth: 0.75, color: white })
    page.drawText('City', { x: x + 6, y: row2Y - FIELD_H + 8, size: 8, font: regular, color: lightGray })
    page.drawRectangle({ x: x + cityW + COL_GAP, y: row2Y - FIELD_H, width: stateW, height: FIELD_H, borderColor: gray, borderWidth: 0.75, color: white })
    page.drawText('State', { x: x + cityW + COL_GAP + 6, y: row2Y - FIELD_H + 8, size: 8, font: regular, color: lightGray })
    page.drawRectangle({ x: x + cityW + stateW + COL_GAP * 2, y: row2Y - FIELD_H, width: zipW, height: FIELD_H, borderColor: gray, borderWidth: 0.75, color: white })
    page.drawText('ZIP', { x: x + cityW + stateW + COL_GAP * 2 + 6, y: row2Y - FIELD_H + 8, size: 8, font: regular, color: lightGray })
    return fieldHeight(f)
  }

  // fill-blank — sentence with underlines for ___
  if (f.type === 'fill-blank') {
    const sentence = f.metadata ?? '___'
    const parts = sentence.split('___')
    let tx = x
    const lineY = inputY - FIELD_H + 8
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (part) {
        const pw = regular.widthOfTextAtSize(part, LABEL_FS)
        if (tx + pw < x + w) {
          page.drawText(part, { x: tx, y: lineY, size: LABEL_FS, font: regular, color: black })
          tx += pw
        }
      }
      if (i < parts.length - 1) {
        const blankW = 60
        page.drawLine({ start: { x: tx, y: lineY - 2 }, end: { x: tx + blankW, y: lineY - 2 }, thickness: 0.75, color: gray })
        tx += blankW + 4
      }
    }
    return fieldHeight(f)
  }

  // table
  if (f.type === 'table') {
    const cols = f.tableColumns ?? ['Column 1', 'Column 2', 'Column 3']
    const rows = f.tableRows ?? 3
    const colW = w / cols.length
    let ty = inputY - 2
    // header row
    for (let ci = 0; ci < cols.length; ci++) {
      page.drawRectangle({ x: x + ci * colW, y: ty - 16, width: colW, height: 16, borderColor: gray, borderWidth: 0.5, color: lightGray })
      page.drawText(clampText(cols[ci], bold, 8, colW - 6), { x: x + ci * colW + 4, y: ty - 12, size: 8, font: bold, color: black })
    }
    ty -= 16
    // data rows
    for (let ri = 0; ri < rows; ri++) {
      for (let ci = 0; ci < cols.length; ci++) {
        page.drawRectangle({ x: x + ci * colW, y: ty - 18, width: colW, height: 18, borderColor: gray, borderWidth: 0.5, color: white })
      }
      ty -= 18
    }
    return fieldHeight(f)
  }

  // default: text/number/date/time/email/phone — simple input box
  page.drawRectangle({ x, y: inputY - FIELD_H, width: w, height: FIELD_H, borderColor: gray, borderWidth: 0.75, color: white })
  if (f.placeholder) {
    page.drawText(clampText(f.placeholder, regular, LABEL_FS, w - 12), { x: x + 6, y: inputY - FIELD_H + 8, size: LABEL_FS, font: regular, color: lightGray })
  }
  return fieldHeight(f)
}

export async function generateFormPDF(form: Form): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const isA4 = form.settings.paperSize === 'A4'
  const isLandscape = form.settings.orientation === 'landscape'
  const bW = isA4 ? A4_W : LT_W
  const bH = isA4 ? A4_H : LT_H
  const pageW = isLandscape ? bH : bW
  const pageH = isLandscape ? bW : bH
  const contentW = pageW - MARGIN * 2

  const accentRgb = hexToRgb(form.settings.primaryColor || '#7c6af7')
  const accent = rgb(accentRgb.r, accentRgb.g, accentRgb.b)
  const black = rgb(0.08, 0.08, 0.12)
  const gray = rgb(0.5, 0.5, 0.55)
  const lightGray = rgb(0.88, 0.88, 0.9)
  const white = rgb(1, 1, 1)

  const ctx: Ctx = { page: null as any, bold, regular, accent, black, gray, lightGray, white, pageW, pageH, contentW }

  for (let pi = 0; pi < form.pages.length; pi++) {
    const formPage = form.pages[pi]
    const page = pdfDoc.addPage([pageW, pageH])
    ctx.page = page

    // Header band
    page.drawRectangle({ x: 0, y: pageH - 64, width: pageW, height: 64, color: accent })
    page.drawText(clampText(form.title, bold, 16, pageW - MARGIN * 2), { x: MARGIN, y: pageH - 36, size: 16, font: bold, color: white })
    if (form.description) {
      page.drawText(clampText(form.description, regular, 9, pageW - MARGIN * 2), { x: MARGIN, y: pageH - 52, size: 9, font: regular, color: rgb(0.9, 0.9, 0.95) })
    }

    let cursorY = pageH - 64 - 20

    if (form.pages.length > 1) {
      page.drawText(formPage.title, { x: MARGIN, y: cursorY, size: 10, font: bold, color: accent })
      cursorY -= 18
    }

    const fields = [...formPage.fields].sort((a, b) => a.order - b.order)
    const rows = groupIntoRows(fields)

    for (const row of rows) {
      // Calculate row height = max field height in this row
      const rowH = Math.max(...row.map(fieldHeight))

      // Check if we need more space (simple overflow prevention)
      if (cursorY - rowH < MARGIN + 20) {
        cursorY = MARGIN + 20  // clamp to bottom margin
      }

      // Draw each field in the row side by side
      const totalSpans = row.reduce((s, f) => s + getColSpan(f), 0)
      const unitW = (contentW - COL_GAP * (row.length - 1)) / Math.max(totalSpans, 12)
      let fieldX = MARGIN

      for (const f of row) {
        const span = getColSpan(f)
        const fw = unitW * span + COL_GAP * (span > 1 && row.length > 1 ? span - 1 : 0)
        drawField(f, fieldX, cursorY, fw, ctx)
        fieldX += fw + COL_GAP
      }

      cursorY -= rowH + ROW_GAP
    }

    // Page numbers
    if (form.settings.showPageNumbers) {
      const label = `Page ${pi + 1} of ${form.pages.length}`
      const lw = regular.widthOfTextAtSize(label, 8)
      page.drawText(label, { x: (pageW - lw) / 2, y: MARGIN / 2, size: 8, font: regular, color: gray })
    }
  }

  return pdfDoc.save()
}
