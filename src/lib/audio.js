/**
 * Tiny WebAudio cue engine. The browser only allows audio after a gesture,
 * so the context is created lazily on the first call (always inside a click).
 */
let context = null
let muted = false

function getContext() {
  if (typeof window === 'undefined') return null
  const AudioCtor = window.AudioContext || window.AudioContext
  if (!AudioCtor) return null
  if (!context) context = new AudioCtor()
  if (context.state === 'suspended') context.resume().catch(() => {})
  return context
}

export function setMuted(value) {
  muted = Boolean(value)
}

export function isMuted() {
  return muted
}

/** Warms the audio context up from a user gesture. */
export function primeAudio() {
  getContext()
}

/**
 * Plays one short sine beep.
 * @param {{ frequency?: number, duration?: number, gain?: number }} options
 */
export function playBeep({ frequency = 780, duration = 0.16, gain = 0.16 } = {}) {
  if (muted) return
  const ctx = getContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const volume = ctx.createGain()
  const now = ctx.currentTime

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, now)
  volume.gain.setValueAtTime(0.0001, now)
  volume.gain.exponentialRampToValueAtTime(gain, now + 0.02)
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  oscillator.connect(volume)
  volume.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + duration + 0.02)
}

/** The tick used while the rest countdown runs. */
export function playCountdownTick(secondsLeft) {
  playBeep({ frequency: secondsLeft <= 1 ? 1180 : 760, duration: 0.12, gain: 0.14 })
}

/** A two-note chime for arriving at the next exercise or finishing. */
export function playChime() {
  playBeep({ frequency: 660, duration: 0.2, gain: 0.15 })
  window.setTimeout(() => playBeep({ frequency: 990, duration: 0.34, gain: 0.15 }), 170)
}

/** A soft click for completing a set. */
export function playSetClick() {
  playBeep({ frequency: 520, duration: 0.1, gain: 0.11 })
}

/** Isınma veya soğuma ses dosyasını oynatır */
export function playWarmupAudio(id) {
  try {
    // id örneğin 'warmup-chest' veya 'cooldown-core' gelir
    const audio = new Audio(`/audio/warmups/${id}.mp3`)
    audio.play().catch((err) => {
      console.warn("Audio play blocked or file missing:", err)
    })
  } catch (e) {
    console.warn("Audio error:", e)
  }
}