/**
 * Storage adapter — mirrors the window.storage API used in Claude artifacts.
 * In production this uses localStorage.
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
    if (!r) return null   // ← return null (not {}) so || fallbacks work correctly
    return JSON.parse(r.value)
  } catch {
    return null
  }
}

export async function saveData(key, data) {
  try {
    await storage.set(key, JSON.stringify(data))
  } catch (e) {
    console.error('saveData error:', e)
  }
}
