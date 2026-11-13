import { useEffect, useRef } from 'react'

const DURATION_MS = 4200
const PARTICLE_COUNT = 140
const GRAVITY = 0.055
const DRAG = 0.995

function themeColors() {
  const styles = getComputedStyle(document.documentElement)
  const read = (token, fallback) => {
    const value = styles.getPropertyValue(token).trim()
    return value || fallback
  }
  return [
    read('--tp-acc', '#7ff5f0'),
    read('--tp-acc-2', '#b48cff'),
    read('--tp-ink', '#dffcff'),
  ]
}

/**
 * Canvas celebration: plankton-bright particles falling and drifting.
 * Runs once on mount, then clears itself.
 */
export function Confetti() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const colors = themeColors()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: width * (0.2 + Math.random() * 0.6),
      y: height * (0.32 + Math.random() * 0.12),
      vx: (Math.random() - 0.5) * 5.5,
      vy: -Math.random() * 7 - 2,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      spin: Math.random() * Math.PI,
      spinSpeed: (Math.random() - 0.5) * 0.2,
      wobble: Math.random() * Math.PI * 2,
    }))

    let frame = 0
    let startedAt = 0

    const draw = (time) => {
      if (!startedAt) startedAt = time
      const age = time - startedAt

      ctx.clearRect(0, 0, width, height)

      for (const particle of particles) {
        particle.vy += GRAVITY
        particle.vx *= DRAG
        particle.vy *= DRAG
        particle.wobble += 0.05
        particle.x += particle.vx + Math.sin(particle.wobble) * 0.6
        particle.y += particle.vy
        particle.spin += particle.spinSpeed

        const fade = age > DURATION_MS - 900 ? Math.max(0, (DURATION_MS - age) / 900) : 1

        ctx.save()
        ctx.globalAlpha = fade
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.spin)
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 12
        ctx.shadowColor = particle.color
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.7)
        ctx.restore()
      }

      if (age < DURATION_MS) {
        frame = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, width, height)
      }
    }

    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
}
