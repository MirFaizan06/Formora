import startupUrl from '../../assets/sounds/startup.mp3'
import successUrl from '../../assets/sounds/success.mp3'
import errorUrl from '../../assets/sounds/error.mp3'
import warningUrl from '../../assets/sounds/warning.mp3'

export type SoundName = 'startup' | 'success' | 'error' | 'warning'

const DEFAULTS: Record<SoundName, string> = {
  startup: startupUrl,
  success: successUrl,
  error: errorUrl,
  warning: warningUrl,
}

const STORAGE_KEY = 'formora:sounds'
const ENABLED_KEY = 'formora:sounds-enabled'

interface SoundSettings {
  enabled: boolean
  customs: Partial<Record<SoundName, string>> // base64 data URLs
}

function readSettings(): SoundSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { enabled: true, customs: {} }
}

function writeSettings(s: SoundSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    localStorage.setItem(ENABLED_KEY, s.enabled ? '1' : '0')
  } catch {}
}

class SoundManager {
  private cache = new Map<string, HTMLAudioElement>()
  private settings: SoundSettings = readSettings()

  private resolve(name: SoundName): string {
    return this.settings.customs[name] ?? DEFAULTS[name]
  }

  private load(src: string): HTMLAudioElement {
    if (this.cache.has(src)) return this.cache.get(src)!
    const audio = new Audio(src)
    audio.volume = 0.55
    audio.preload = 'auto'
    this.cache.set(src, audio)
    return audio
  }

  play(name: SoundName): void {
    if (!this.settings.enabled) return
    try {
      const src = this.resolve(name)
      const audio = this.load(src)
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch {}
  }

  get enabled(): boolean {
    return this.settings.enabled
  }

  setEnabled(v: boolean): void {
    this.settings.enabled = v
    writeSettings(this.settings)
  }

  /** Set a custom sound from a base64 data URL. Pass null to reset to default. */
  setCustomSound(name: SoundName, dataUrl: string | null): void {
    if (dataUrl === null) {
      delete this.settings.customs[name]
    } else {
      this.settings.customs[name] = dataUrl
      // Evict cached audio so new src is loaded on next play
      this.cache.delete(dataUrl)
    }
    // Evict old cached audio for this sound
    const old = this.resolve(name)
    this.cache.delete(old)
    writeSettings(this.settings)
  }

  getCustomSound(name: SoundName): string | null {
    return this.settings.customs[name] ?? null
  }

  getSettings(): Readonly<SoundSettings> {
    return this.settings
  }
}

export const soundManager = new SoundManager()
