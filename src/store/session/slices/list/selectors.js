/**
 * 会话列表相关的选择器
 */
export const sessionListSelectors = {
  /**
   * 获取当前活动会话ID
   * @param {Object} state - 状态对象
   * @returns {string|null} 活动会话ID
   */
  activeSessionId: (state) => state.activeSessionId,
  
  /**
   * 获取所有会话
   * @param {Object} state - 状态对象
   * @returns {Array} 会话列表
   */
  sessions: (state) => state.sessions,
  
  /**
   * 获取当前活动会话
   * @param {Object} state - 状态对象
   * @returns {Object|undefined} 活动会话对象
   */
  activeSession: (state) => 
    state.sessions.find(session => session.id === state.activeSessionId),
  
  /**
   * 获取会话加载状态
   * @param {Object} state - 状态对象
   * @returns {boolean} 加载状态
   */
  isSessionsLoading: (state) => state.sessionsLoading,
  
  /**
   * 获取会话错误信息
   * @param {Object} state - 状态对象
   * @returns {string|null} 错误信息
   */
  sessionsError: (state) => state.sessionsError
}; 