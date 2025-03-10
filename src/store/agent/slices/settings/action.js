/**
 * 创建代理设置相关的状态和动作
 * @param {Function} set - 设置状态的函数
 * @param {Function} get - 获取状态的函数
 * @returns {Object} 代理设置相关的状态和动作
 */
export const createAgentSettingsSlice = (set, get) => ({
  /**
   * 更新代理设置
   * @param {Object} updates - 更新内容
   */
  updateAgentSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...updates
      }
    }));
  },

  /**
   * 设置代理模型
   * @param {string} model - 模型名称
   */
  setAgentModel: (model) => {
    set((state) => ({
      settings: {
        ...state.settings,
        model
      }
    }));
  },

  /**
   * 设置代理温度
   * @param {number} temperature - 温度值
   */
  setAgentTemperature: (temperature) => {
    set((state) => ({
      settings: {
        ...state.settings,
        temperature
      }
    }));
  },

  /**
   * 设置最大响应令牌数
   * @param {number} maxResponseTokens - 最大响应令牌数
   */
  setAgentMaxResponseTokens: (maxResponseTokens) => {
    set((state) => ({
      settings: {
        ...state.settings,
        maxResponseTokens
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