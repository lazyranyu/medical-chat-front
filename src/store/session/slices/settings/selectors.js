/**
 * 会话设置相关的选择器
 */
export const sessionSettingsSelectors = {
  /**
   * 获取会话设置
   * @param {Object} state - 状态对象
   * @returns {Object} 会话设置
   */
  sessionSettings: (state) => state.sessionSettings,
  
  /**
   * 获取是否启用历史记录
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否启用
   */
  enableHistory: (state) => state.sessionSettings.enableHistory,
  
  /**
   * 获取是否启用自动保存
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否启用
   */
  enableAutoSave: (state) => state.sessionSettings.enableAutoSave,
  
  /**
   * 获取自动保存间隔
   * @param {Object} state - 状态对象
   * @returns {number} 间隔时间（毫秒）
   */
  autoSaveInterval: (state) => state.sessionSettings.autoSaveInterval,
  
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