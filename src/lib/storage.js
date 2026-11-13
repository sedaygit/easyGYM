const PREFIX = 'easygym'

export const STORAGE_KEYS = {
  user: `${PREFIX}.user`,
  prefs: `${PREFIX}.prefs`,
  selection: `${PREFIX}.selection`,
  history: `${PREFIX}.history`,
  sound: `${PREFIX}.sound`,
}
// User-specific storage keys for preferences, selection, and history
export function getUserStorageKey(userId, key) {
  return `${STORAGE_KEYS[key]}.${userId}`
}

/** Reads JSON from localStorage, falling back when unavailable or corrupt. */
export function readStored(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/** Writes JSON to localStorage. Storage failures never break the UI. */
export function writeStored(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode or quota — the session still works in memory */
  }
}

export function removeStored(key) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
