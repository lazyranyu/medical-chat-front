/**
 * 创建会话设置相关的状态和动作
 * @param {Function} set - 设置状态的函数
 * @param {Function} get - 获取状态的函数
 * @returns {Object} 会话设置相关的状态和动作
 */
export const createSessionSettingsSlice = (set, get) => ({
  /**
   * 更新会话设置
   * @param {Object} updates - 更新内容
   */
  updateSessionSettings: (updates) => {
    set((state) => ({
      sessionSettings: {
        ...state.sessionSettings,
        ...updates
      }
    }));
  },

  /**
   * 设置是否启用历史记录
   * @param {boolean} enable - 是否启用
   */
  setEnableHistory: (enable) => {
    set((state) => ({
      sessionSettings: {
        ...state.sessionSettings,
        enableHistory: enable
      }
    }));
  },

  /**
   * 设置是否启用自动保存
   * @param {boolean} enable - 是否启用
   */
  setEnableAutoSave: (enable) => {
    set((state) => ({
      sessionSettings: {
        ...state.sessionSettings,
        enableAutoSave: enable
      }
    }));
  },

  /**
   * 设置自动保存间隔
   * @param {number} interval - 间隔时间（毫秒）
   */
  setAutoSaveInterval: (interval) => {
    set((state) => ({
      sessionSettings: {
        ...state.sessionSettings,
        autoSaveInterval: interval
      }
    }));
  },

  /**
   * 设置设置加载状态
   * @param {boolean} loading - 加载状态
   */
  setSettingsLoading: (loading) => {
    set({ settingsLoading: loading });
  },

  /**
   * 设置设置错误信息
   * @param {string|null} error - 错误信息
   */
  setSettingsError: (error) => {
    set({ settingsError: error });
  }
}); 