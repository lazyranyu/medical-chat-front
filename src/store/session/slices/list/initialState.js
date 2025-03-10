/**
 * 会话列表相关初始状态
 */
export const initialSessionListState = {
  // 会话列表
  sessions: [],
  
  // 当前活动的会话ID
  activeSessionId: null,
  
  // 会话加载状态
  sessionsLoading: false,
  
  // 会话错误信息
  sessionsError: null,
}; 