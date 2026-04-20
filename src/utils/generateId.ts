const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function generateId(): string {
  const base = Date.now().toString(36)
  let random = ''
  for (let i = 0; i < 6; i++) {
    random += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return (base + random).slice(-12).padStart(12, '0')
}
