import { ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

const ENCRYPTION_KEY = 'formora-grey-phoenix-studios-32b'
const IV_LENGTH = 16

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

function decrypt(text: string): string {
  const [ivHex, encrypted] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export function registerFormHandlers(dataDir: string) {
  const formsFile = path.join(dataDir, 'forms.enc')

  ipcMain.handle('form:load-all', async () => {
    try {
      if (!fs.existsSync(formsFile)) return []
      const encrypted = fs.readFileSync(formsFile, 'utf8')
      const decrypted = decrypt(encrypted)
      return JSON.parse(decrypted)
    } catch {
      return []
    }
  })

  ipcMain.handle('form:save-all', async (_event, forms: unknown) => {
    try {
      const json = JSON.stringify(forms)
      const encrypted = encrypt(json)
      fs.writeFileSync(formsFile, encrypted, 'utf8')
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  })

  ipcMain.handle('form:save', async (_event, form: { id: string }) => {
    try {
      let forms: unknown[] = []
      if (fs.existsSync(formsFile)) {
        const encrypted = fs.readFileSync(formsFile, 'utf8')
        forms = JSON.parse(decrypt(encrypted))
      }
      const idx = forms.findIndex((f: any) => f.id === form.id)
      if (idx >= 0) forms[idx] = form
      else forms.push(form)
      fs.writeFileSync(formsFile, encrypt(JSON.stringify(forms)), 'utf8')
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  })

  ipcMain.handle('form:delete', async (_event, id: string) => {
    try {
      if (!fs.existsSync(formsFile)) return { success: true }
      const encrypted = fs.readFileSync(formsFile, 'utf8')
      const forms: unknown[] = JSON.parse(decrypt(encrypted))
      const filtered = forms.filter((f: any) => f.id !== id)
      fs.writeFileSync(formsFile, encrypt(JSON.stringify(filtered)), 'utf8')
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  })
}
