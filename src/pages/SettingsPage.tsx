import { useRef, useState, useEffect } from 'react'
import { Moon, Sun, Flame, Trees, Zap, Info, Volume2, VolumeX, Upload, RotateCcw, Keyboard } from 'lucide-react'
import { useUIStore, ALL_THEMES, type Theme } from '../store/useUIStore'
import { soundManager, type SoundName } from '../services/sound/SoundManager'
import KeyboardShortcuts from '../components/ui/KeyboardShortcuts'

const THEME_META: Record<Theme, { label: string; icon: React.ReactNode; swatch: string }> = {
  dark:     { label: 'Dark',     icon: <Moon size={14} />,   swatch: '#1e1e2e' },
  light:    { label: 'Light',    icon: <Sun size={14} />,    swatch: '#f5f5f0' },
  crimson:  { label: 'Crimson',  icon: <Flame size={14} />,  swatch: '#1f1616' },
  forest:   { label: 'Forest',   icon: <Trees size={14} />,  swatch: '#141f14' },
  midnight: { label: 'Midnight', icon: <Zap size={14} />,    swatch: '#000000' },
}

const SOUND_META: { name: SoundName; label: string; desc: string }[] = [
  { name: 'startup', label: 'Startup',  desc: 'Plays after the splash screen closes' },
  { name: 'success', label: 'Success',  desc: 'Plays on successful save / export' },
  { name: 'error',   label: 'Error',    desc: 'Plays on failed operations' },
  { name: 'warning', label: 'Warning',  desc: 'Plays when a confirmation dialog opens' },
]

const MAX_SOUND_BYTES = 2 * 1024 * 1024 // 2 MB

function SoundRow({ name, label, desc }: { name: SoundName; label: string; desc: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [customName, setCustomName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const custom = soundManager.getCustomSound(name)
    setCustomName(custom ? 'Custom file loaded' : null)
  }, [name])

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    if (!file.type.startsWith('audio/')) {
      setError('Only audio files are allowed.')
      return
    }
    if (file.size > MAX_SOUND_BYTES) {
      setError('File must be under 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      soundManager.setCustomSound(name, dataUrl)
      setCustomName(file.name)
    }
    reader.readAsDataURL(file)
    // Reset input so same file can be re-uploaded
    e.target.value = ''
  }

  function handleReset() {
    soundManager.setCustomSound(name, null)
    setCustomName(null)
    setError(null)
  }

  function handlePreview() {
    soundManager.play(name)
  }

  return (
    <div className="settings-sound-row">
      <div className="settings-sound-row__info">
        <span className="settings-row__label">{label}</span>
        <span className="settings-row__desc">{desc}</span>
        {customName && <span className="settings-sound-row__custom">{customName}</span>}
        {error && <span className="settings-sound-row__error">{error}</span>}
      </div>
      <div className="settings-sound-row__actions">
        <button className="btn btn-ghost btn-sm" onClick={handlePreview} title="Preview sound">
          <Volume2 size={14} /> Preview
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
          <Upload size={14} /> Upload
        </button>
        {customName && (
          <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset to default">
            <RotateCcw size={13} />
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const [soundEnabled, setSoundEnabled] = useState(soundManager.enabled)
  const [showShortcuts, setShowShortcuts] = useState(false)

  function toggleSound() {
    const next = !soundEnabled
    soundManager.setEnabled(next)
    setSoundEnabled(next)
  }

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      {/* ── Appearance ── */}
      <section className="settings-section">
        <h2 className="settings-section__title">Appearance</h2>
        <div className="settings-row settings-row--column">
          <div className="settings-row__info">
            <span className="settings-row__label">Theme</span>
            <span className="settings-row__desc">Choose a color theme for the app</span>
          </div>
          <div className="theme-picker">
            {ALL_THEMES.map((t) => {
              const meta = THEME_META[t]
              return (
                <button
                  key={t}
                  className={`theme-picker__item${theme === t ? ' theme-picker__item--active' : ''}`}
                  onClick={() => setTheme(t)}
                  title={meta.label}
                >
                  <span
                    className="theme-picker__swatch"
                    style={{ background: meta.swatch }}
                  />
                  <span className="theme-picker__icon">{meta.icon}</span>
                  <span className="theme-picker__label">{meta.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Sounds ── */}
      <section className="settings-section">
        <h2 className="settings-section__title">Sounds</h2>

        <div className="settings-row">
          <div className="settings-row__info">
            <span className="settings-row__label">Enable Sounds</span>
            <span className="settings-row__desc">Play audio feedback for app events</span>
          </div>
          <button
            className={`settings-toggle${soundEnabled ? ' settings-toggle--on' : ''}`}
            onClick={toggleSound}
            aria-label="Toggle sounds"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span className="settings-toggle__track">
              <span className="settings-toggle__thumb" />
            </span>
            <span>{soundEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>

        {soundEnabled && (
          <div className="settings-sounds-list">
            {SOUND_META.map((s) => (
              <SoundRow key={s.name} {...s} />
            ))}
            <p className="settings-sounds-note">
              Custom sounds must be audio files under 2 MB. Stored locally in your browser profile.
            </p>
          </div>
        )}
      </section>

      {/* ── Keyboard Shortcuts ── */}
      <section className="settings-section">
        <h2 className="settings-section__title">Keyboard Shortcuts</h2>
        <div className="settings-row">
          <div className="settings-row__info">
            <span className="settings-row__label">Manage Keybindings</span>
            <span className="settings-row__desc">View and reassign keyboard shortcuts</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowShortcuts(true)}>
            <Keyboard size={14} /> Open Shortcuts
          </button>
        </div>
      </section>

      {/* ── About ── */}
      <section className="settings-section">
        <h2 className="settings-section__title">About</h2>
        <div className="settings-about">
          <div className="settings-about__logo">
            <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
              <defs>
                <linearGradient id="about-grad" x1="40" y1="10" x2="40" y2="72" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff9a3c" />
                  <stop offset="100%" stopColor="#c026d3" />
                </linearGradient>
              </defs>
              <path d="M40 72 C34 62,26 52,28 40 C30 32,36 26,40 10 C44 26,50 32,52 40 C54 52,46 62,40 72Z" fill="url(#about-grad)" />
              <circle cx="40" cy="42" r="3.5" fill="#fff" opacity="0.9" />
            </svg>
          </div>
          <div>
            <p className="settings-about__name">Formora</p>
            <p className="settings-about__version">Version 1.0.0</p>
            <p className="settings-about__dev">Developed by Faizan Mir</p>
            <p className="settings-about__company">Grey Phoenix Studios</p>
            <a className="settings-about__email" href="mailto:mirfaizan8803@gmail.com">
              mirfaizan8803@gmail.com
            </a>
          </div>
        </div>
      </section>

      <KeyboardShortcuts open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  )
}
