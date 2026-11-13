const MINUTE = 60
const HOUR = 60 * MINUTE

const getLocale = (language = 'en') =>
  language === 'tr' ? 'tr-TR' : 'en-US'

export function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(safe / MINUTE)
  const seconds = safe % MINUTE
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function formatDuration(totalSeconds, language = 'en') {
  const safe = Math.max(0, Math.round(totalSeconds))

  if (language === 'tr') {
    if (safe < MINUTE) return `${safe} sn`
    if (safe < HOUR) return `${Math.round(safe / MINUTE)} dk`

    const hours = Math.floor(safe / HOUR)
    const minutes = Math.round((safe % HOUR) / MINUTE)

    return `${hours} sa ${String(minutes).padStart(2, '0')} dk`
  }

  if (safe < MINUTE) return `${safe} sec`
  if (safe < HOUR) return `${Math.round(safe / MINUTE)} min`

  const hours = Math.floor(safe / HOUR)
  const minutes = Math.round((safe % HOUR) / MINUTE)

  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

export function dayKey(date) {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function formatDayLabel(
  value,
  language = 'en',
  todayLabel = 'Today',
  yesterdayLabel = 'Yesterday'
) {
  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (dayKey(date) === dayKey(today)) return todayLabel
  if (dayKey(date) === dayKey(yesterday)) return yesterdayLabel

  return date.toLocaleDateString(getLocale(language), {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() === today.getFullYear()
      ? undefined
      : 'numeric',
  })
}

export function formatTimeOfDay(value, language = 'en') {
  return new Date(value).toLocaleTimeString(getLocale(language), {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateHeading(value, language = 'en') {
  return new Date(value).toLocaleDateString(getLocale(language), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatDate(value, language = 'en') {
  return new Date(value).toLocaleDateString(getLocale(language), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}