/**
 * Storage adapter — mirrors the window.storage API used in Claude artifacts.
 * In production this uses localStorage. Swap with any key-value backend (Supabase, Firebase, etc.)
 */

export const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key)
      if (value === null) return null
      return { key, value }
    } catch {
      return null
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value)
      return { key, value }
    } catch {
      return null
    }
  },
  async delete(key) {
    try {
      localStorage.removeItem(key)
      return { key, deleted: true }
    } catch {
      return null
    }
  },
  async list(prefix = '') {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix))
      return { keys, prefix }
    } catch {
      return { keys: [] }
    }
  },
}

export async function loadData(key) {
  try {
    const r = await storage.get(key)
    return r ? JSON.parse(r.value) : {}
  } catch {
    return {}
  }
}

export async function saveData(key, data) {
  try {
    await storage.set(key, JSON.stringify(data))
  } catch (e) {
    console.error('saveData error:', e)
  }
}
