/**
 * 创建会话列表相关的状态和动作
 * @param {Function} set - 设置状态的函数
 * @param {Function} get - 获取状态的函数
 * @returns {Object} 会话列表相关的状态和动作
 */
export const createSessionListSlice = (set, get) => ({
  /**
   * 设置活动会话
   * @param {string} sessionId - 会话ID
   */
  setActiveSession: (sessionId) => {
    set({ activeSessionId: sessionId });
  },

  /**
   * 添加新会话
   * @param {Object} session - 会话对象
   */
  addSession: (session) => {
    set((state) => ({
      sessions: [...state.sessions, session]
    }));
  },

  /**
   * 更新会话
   * @param {string} sessionId - 会话ID
   * @param {Object} updates - 更新内容
   */
  updateSession: (sessionId, updates) => {
    set((state) => ({
      sessions: state.sessions.map((session) => 
        session.id === sessionId ? { ...session, ...updates } : session
      )
    }));
  },

  /**
   * 删除会话
   * @param {string} sessionId - 会话ID
   */
  removeSession: (sessionId) => {
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== sessionId),
      // 如果删除的是当前活动会话，则将活动会话设为null
      activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId
    }));
  },

  /**
   * 设置会话加载状态
   * @param {boolean} loading - 加载状态
   */
  setSessionsLoading: (loading) => {
    set({ sessionsLoading: loading });
  },

  /**
   * 设置会话错误信息
   * @param {string|null} error - 错误信息
   */
  setSessionsError: (error) => {
    set({ sessionsError: error });
  }
}); 