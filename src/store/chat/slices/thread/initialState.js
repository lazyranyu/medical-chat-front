/**
 * 聊天线程切片 - 初始状态
 * 
 * 定义了对话线程管理相关的初始状态
 * 线程是对话的分支，允许用户在同一对话中探索不同的回答方向
 */

export const initialThreadState = {
  isCreatingThread: false, // 是否正在创建新线程的标志
  newThreadMode: 'continuation', // 新线程的创建模式，可以是'continuation'(继续)或其他模式
  threadInputMessage: "", // 线程输入框中的消息内容
  threadLoadingIds: [], // 正在加载中的线程ID列表
  threadMaps: {}, // 线程映射表，以ID为键存储所有线程
  threadsInit: false // 线程是否已初始化的标志
}
