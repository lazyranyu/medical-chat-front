/**
 * 代理设置相关的选择器
 */
export const agentSettingsSelectors = {
  /**
   * 获取代理设置
   * @param {Object} state - 状态对象
   * @returns {Object} 代理设置
   */
  settings: (state) => state.settings,
  
  /**
   * 获取代理模型
   * @param {Object} state - 状态对象
   * @returns {string} 模型名称
   */
  model: (state) => state.settings.model,
  
  /**
   * 获取代理温度
   * @param {Object} state - 状态对象
   * @returns {number} 温度值
   */
  temperature: (state) => state.settings.temperature,
  
  /**
   * 获取最大响应令牌数
   * @param {Object} state - 状态对象
   * @returns {number} 最大响应令牌数
   */
  maxResponseTokens: (state) => state.settings.maxResponseTokens,
  
  /**
   * 获取设置加载状态
   * @param {Object} state - 状态对象
   * @returns {boolean} 加载状态
   */
  isSettingsLoading: (state) => state.settingsLoading,
  
  /**
   * 获取设置错误信息
   * @param {Object} state - 状态对象
   * @returns {string|null} 错误信息
   */
  settingsError: (state) => state.settingsError
}; 