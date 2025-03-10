/**
 * 服务器配置相关的选择器
 */
export const serverConfigSelectors = {
  /**
   * 获取服务器配置
   * @param {Object} state - 状态对象
   * @returns {Object} 服务器配置
   */
  serverConfig: (state) => state.serverConfig,
  
  /**
   * 获取 API 基础 URL
   * @param {Object} state - 状态对象
   * @returns {string} API 基础 URL
   */
  apiBaseUrl: (state) => state.serverConfig.apiBaseUrl,
  
  /**
   * 获取是否启用 WebSocket
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否启用
   */
  enableWebSocket: (state) => state.serverConfig.enableWebSocket,
  
  /**
   * 获取 WebSocket URL
   * @param {Object} state - 状态对象
   * @returns {string} WebSocket URL
   */
  webSocketUrl: (state) => state.serverConfig.webSocketUrl,
  
  /**
   * 获取是否启用 HTTPS
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否启用
   */
  enableHttps: (state) => state.serverConfig.enableHttps,
  
  /**
   * 获取是否启用认证
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否启用
   */
  enableAuth: (state) => state.serverConfig.enableAuth,
  
  /**
   * 获取配置加载状态
   * @param {Object} state - 状态对象
   * @returns {boolean} 加载状态
   */
  isConfigLoading: (state) => state.configLoading,
  
  /**
   * 获取配置错误信息
   * @param {Object} state - 状态对象
   * @returns {string|null} 错误信息
   */
  configError: (state) => state.configError
}; 