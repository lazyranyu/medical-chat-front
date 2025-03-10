/**
 * 创建线程相关的状态和动作
 * @param {Function} set - 设置状态的函数
 * @param {Function} get - 获取状态的函数
 * @returns {Object} 线程相关的状态和动作
 */
export const createThreadSlice = (set, get) => ({
  /**
   * 设置活动线程
   * @param {string} threadId - 线程ID
   */
  setActiveThread: (threadId) => {
    set({ activeThreadId: threadId });
  },

  /**
   * 添加新线程
   * @param {Object} thread - 线程对象
   */
  addThread: (thread) => {
    set((state) => ({
      threads: [...state.threads, thread]
    }));
  },

  /**
   * 更新线程
   * @param {string} threadId - 线程ID
   * @param {Object} updates - 更新内容
   */
  updateThread: (threadId, updates) => {
    set((state) => ({
      threads: state.threads.map((thread) => 
        thread.id === threadId ? { ...thread, ...updates } : thread
      )
    }));
  },

  /**
   * 删除线程
   * @param {string} threadId - 线程ID
   */
  removeThread: (threadId) => {
    set((state) => ({
      threads: state.threads.filter((thread) => thread.id !== threadId),
      // 如果删除的是当前活动线程，则将活动线程设为null
      activeThreadId: state.activeThreadId === threadId ? null : state.activeThreadId
    }));
  },

  /**
   * 设置线程加载状态
   * @param {boolean} loading - 加载状态
   */
  setThreadLoading: (loading) => {
    set({ threadLoading: loading });
  },

  /**
   * 设置线程错误信息
   * @param {string|null} error - 错误信息
   */
  setThreadError: (error) => {
    set({ threadError: error });
  }
}); 