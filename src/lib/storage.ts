const STORAGE_PREFIX = 'atelier_'

export function getStorageItem<T>(key: string, fallback: T): T {
  if (import.meta.server) return fallback

  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  if (import.meta.server) return false

  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorageItem(key: string): void {
  if (import.meta.server) return

  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    // memory fallback handled by caller
  }
}
