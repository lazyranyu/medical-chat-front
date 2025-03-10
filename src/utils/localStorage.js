const PREV_KEY = "LOBE_GLOBAL"

export class AsyncLocalStorage {
  constructor(storageKey) {
    this.storageKey = storageKey

    // skip server side rendering
    if (typeof window === "undefined") return

    // migrate old data
    if (localStorage.getItem(PREV_KEY)) {
      const data = JSON.parse(localStorage.getItem(PREV_KEY) || "{}")

      const preference = data.state.preference

      if (data.state?.preference) {
        localStorage.setItem("LOBE_PREFERENCE", JSON.stringify(preference))
      }
      localStorage.removeItem(PREV_KEY)
    }
  }

  async saveToLocalStorage(state) {
    const data = await this.getFromLocalStorage()

    localStorage.setItem(this.storageKey, JSON.stringify({ ...data, ...state }))
  }

  async getFromLocalStorage(key = this.storageKey) {
    return JSON.parse(localStorage.getItem(key) || "{}")
  }
}
