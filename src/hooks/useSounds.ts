import { soundManager } from '../services/sound/SoundManager'

export function useSounds() {
  return {
    playStartup: () => soundManager.play('startup'),
    playSuccess: () => soundManager.play('success'),
    playError: () => soundManager.play('error'),
    playWarning: () => soundManager.play('warning'),
  }
}
