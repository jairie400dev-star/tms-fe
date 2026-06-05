// Pass session=true to use sessionStorage (cleared when the browser closes).
const backend = (session) => (session ? window.sessionStorage : window.localStorage)

export const getStorage = (key, defaultValue = '', session = false) => {
  try {
    const value = backend(session).getItem(key)
    return value !== null ? value : defaultValue
  } catch {
    return defaultValue
  }
}

export const setStorage = (key, value, session = false) => {
  try {
    backend(session).setItem(key, String(value))
  } catch {
    // Ignore storage failures in browsers with restricted storage.
  }
}

export const removeStorage = (key, session = false) => {
  try {
    backend(session).removeItem(key)
  } catch {
    // Ignore storage failures.
  }
}

export const getJsonStorage = (key, defaultValue = null, session = false) => {
  try {
    const value = backend(session).getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch {
    return defaultValue
  }
}

export const setJsonStorage = (key, value, session = false) => {
  try {
    backend(session).setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage failures.
  }
}

export const includesText = (value, query) => {
  if (!query) return true
  if (value == null) return false
  return String(value).toLowerCase().includes(String(query).toLowerCase())
}

export const formatShortDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const toInitials = (value) => {
  if (!value) return ''
  const parts = String(value).trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
