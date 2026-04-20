import { useEffect, useRef } from 'react'
import { motion, type Transition } from 'framer-motion'

interface SplashProps {
  onDone: () => void
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut' as const, delay } as Transition,
})

export default function Splash({ onDone }: SplashProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(handleGetStarted, 5000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function handleGetStarted() {
    if (timerRef.current) clearTimeout(timerRef.current)
    localStorage.setItem('formora:splash-v2', '1')
    onDone()
  }

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background radial glow */}
      <div className="splash-screen__glow" />

      {/* Phoenix logo */}
      <motion.div
        className="splash-logo"
        initial={{ opacity: 0, scale: 0.6, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg width="96" height="96" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sp-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6a1a" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#c026d3" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="sp-flame" x1="40" y1="10" x2="40" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff9a3c" />
              <stop offset="50%" stopColor="#ff4d1a" />
              <stop offset="100%" stopColor="#c026d3" />
            </linearGradient>
            <linearGradient id="sp-wl" x1="0" y1="30" x2="36" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff6a1a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c026d3" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="sp-wr" x1="80" y1="30" x2="44" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff6a1a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c026d3" stopOpacity="0.5" />
            </linearGradient>
            <filter id="sp-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx="40" cy="40" r="38" fill="url(#sp-bg)" />
          <path d="M40 50 C30 44,12 38,6 28 C10 34,16 40,26 46 C18 42,10 32,14 22 C20 30,28 38,40 44Z" fill="url(#sp-wl)" />
          <path d="M40 50 C50 44,68 38,74 28 C70 34,64 40,54 46 C62 42,70 32,66 22 C60 30,52 38,40 44Z" fill="url(#sp-wr)" />
          <path d="M40 72 C34 62,26 52,28 40 C30 32,36 26,40 10 C44 26,50 32,52 40 C54 52,46 62,40 72Z" fill="url(#sp-flame)" filter="url(#sp-glow)" />
          <path d="M40 62 C37 55,33 48,34 42 C35 37,38 32,40 22 C42 32,45 37,46 42 C47 48,43 55,40 62Z" fill="#ffcf80" opacity="0.7" />
          <circle cx="40" cy="42" r="3.5" fill="#fff" opacity="0.9" />
        </svg>
      </motion.div>

      {/* App name */}
      <motion.h1 className="splash-title" {...fadeUp(0.25)}>Formora</motion.h1>

      {/* Studio */}
      <motion.p className="splash-subtitle" {...fadeUp(0.4)}>Grey Phoenix Studios</motion.p>

      {/* Tagline */}
      <motion.p className="splash-desc" {...fadeUp(0.55)}>
        Build beautiful forms. Export anywhere.
      </motion.p>

      {/* CTA */}
      <motion.div {...fadeUp(0.7)}>
        <button className="splash-btn" onClick={handleGetStarted}>
          Get Started &rarr;
        </button>
      </motion.div>

      {/* Progress bar */}
      <motion.div className="splash-progress" {...fadeUp(0.8)}>
        <div className="splash-progress__bar" />
      </motion.div>

      {/* Version */}
      <motion.p className="splash-version" {...fadeUp(0.9)}>v1.0.0</motion.p>
    </motion.div>
  )
}
