/**
 * 聊天消息切片 - 初始状态
 * 
 * 定义了消息管理相关的初始状态
 * 这些状态用于跟踪消息的加载、编辑和存储状态
 */

export const initialMessageState = {
  activeId: "inbox", // 当前活动的消息ID，默认为收件箱
  isCreatingMessage: false, // 是否正在创建新消息的标志
  messageEditingIds: [], // 正在编辑中的消息ID列表
  messageLoadingIds: [], // 正在加载中的消息ID列表
  messagesInit: false, // 消息是否已初始化的标志
  messagesMap: {} // 消息映射表，以ID为键存储所有消息
}
