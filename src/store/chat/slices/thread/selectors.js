/**
 * 线程相关的选择器
 */
export const threadSelectors = {
  /**
   * 获取当前活动线程ID
   * @param {Object} state - 状态对象
   * @returns {string|null} 活动线程ID
   */
  activeThreadId: (state) => state.activeThreadId,
  
  /**
   * 获取所有线程
   * @param {Object} state - 状态对象
   * @returns {Array} 线程列表
   */
  threads: (state) => state.threads,
  
  /**
   * 获取当前活动线程
   * @param {Object} state - 状态对象
   * @returns {Object|undefined} 活动线程对象
   */
  activeThread: (state) => 
    state.threads.find(thread => thread.id === state.activeThreadId),
  
  /**
   * 获取线程加载状态
   * @param {Object} state - 状态对象
   * @returns {boolean} 加载状态
   */
  isThreadLoading: (state) => state.threadLoading,
  
  /**
   * 获取线程错误信息
   * @param {Object} state - 状态对象
   * @returns {string|null} 错误信息
   */
  threadError: (state) => state.threadError,
  
  /**
   * 获取当前主题的所有线程
   * @param {Object} state - 状态对象
   * @returns {Array} 当前主题的线程列表
   */
  currentTopicThreads: (state) => {
    // 如果没有指定主题ID，则返回空数组
    if (!state.activeTopicId) return [];
    
    // 返回与当前主题相关的线程
    return state.threads.filter(thread => thread.topicId === state.activeTopicId);
  },
  
  /**
   * 根据源消息ID获取线程
   * @param {string} id - 源消息ID
   * @returns {Function} 返回一个函数，该函数接收状态对象并返回线程列表
   */
  getThreadsBySourceMsgId: (id) => (state) => {
    return state.threads.filter(thread => thread.sourceMessageId === id);
  },
  
  /**
   * 检查是否存在以特定消息ID为源的线程
   * @param {string} id - 源消息ID
   * @returns {Function} 返回一个函数，该函数接收状态对象并返回布尔值
   */
  hasThreadBySourceMsgId: (id) => (state) => {
    const threads = threadSelectors.currentTopicThreads(state);
    return threads.some(thread => thread.sourceMessageId === id);
  }
}; 