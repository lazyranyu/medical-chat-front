import { ThreadType } from "@/types/topic"

/**
 * 线程选择器工具函数
 * 
 * 提供用于生成线程消息的辅助函数
 */

/**
 * 根据消息列表、起始消息ID和线程模式生成消息列表
 * 
 * 此函数用于从原始消息列表中提取出与线程相关的消息，
 * 根据不同的线程模式（如"all"或其他）返回不同的消息子集
 * 
 * @param {Array} messages - 原始消息列表
 * @param {string} startMessageId - 起始消息ID，用于确定从哪条消息开始
 * @param {string} threadMode - 线程模式，决定如何过滤消息
 * @returns {Array} 过滤后的消息列表
 */
export const genMessage = (messages, startMessageId, threadMode) => {
  if (!startMessageId) return []

  // 如果是独立话题模式，则只显示话题开始消息
  if (threadMode === ThreadType.Standalone) {
    return messages.filter(m => m.id === startMessageId)
  }

  // 如果是连续模式下，那么只显示话题开始消息和话题分割线
  const targetIndex = messages.findIndex(item => item.id === startMessageId)

  if (targetIndex < 0) return []

  return messages.slice(0, targetIndex + 1)
}
