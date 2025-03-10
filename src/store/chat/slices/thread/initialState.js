/**
 * 线程状态的初始值
 */
export const initialThreadState = {
  // 当前活动的线程ID
  activeThreadId: null,
  
  // 线程列表
  threads: [],
  
  // 线程加载状态
  threadLoading: false,
  
  // 线程错误信息
  threadError: null
}; 