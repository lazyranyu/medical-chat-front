/**
 * 聊天线程切片 - 选择器
 * 
 * 定义了用于从状态中提取线程相关数据的选择器函数
 * 这些选择器用于在组件中访问和过滤线程数据
 */

import { THREAD_DRAFT_ID } from "@/const/message" // 线程草稿ID常量
import { useAgentStore } from "@/store/agent" // 代理状态管理hook
import { agentChatConfigSelectors } from "@/store/agent/selectors" // 代理聊天配置选择器
import { chatHelpers } from "@/store/chat/helpers" // 聊天辅助函数

import {messageSelectors as messageSelector, messageSelectors} from "../../message/selectors" // 消息选择器
import { genMessage } from "./util" // 生成消息的工具函数

/**
 * 获取当前话题的所有线程
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 当前话题的线程列表
 */
const currentTopicThreads = s => {
  if (!s.activeTopicId) return []

  return s.threadMaps[s.activeTopicId] || []
}

/**
 * 获取当前门户中显示的线程
 * 
 * @param {Object} s - 状态对象
 * @returns {Object|undefined} 当前门户线程对象
 */
const currentPortalThread = s => {
  if (!s.portalThreadId) return undefined

  const threads = currentTopicThreads(s)

  return threads.find(t => t.id === s.portalThreadId)
}

/**
 * 获取线程起始消息ID
 * 
 * @param {Object} s - 状态对象
 * @returns {string|undefined} 线程起始消息ID
 */
const threadStartMessageId = s => s.threadStartMessageId

/**
 * 获取线程源消息ID
 * 根据是否正在创建新线程返回不同的ID
 * 
 * @param {Object} s - 状态对象
 * @returns {string|undefined} 线程源消息ID
 */
const threadSourceMessageId = s => {
  if (s.startToForkThread) return threadStartMessageId(s)

  const portalThread = currentPortalThread(s)
  return portalThread?.sourceMessageId
}

/**
 * 获取线程父消息
 * 根据线程类型和起始消息ID生成父消息列表
 * 
 * @param {Object} s - 状态对象
 * @param {Array} data - 消息数据
 * @returns {Array} 父消息列表
 */
const getTheadParentMessages = (s, data) => {
  if (s.startToForkThread) {
    const startMessageId = threadStartMessageId(s)

    // 存在threadId的消息是子消息，在创建父消息时需要忽略
    const messages = data.filter(m => !m.threadId)
    return genMessage(messages, startMessageId, s.newThreadMode)
  }

  const portalThread = currentPortalThread(s)
  return genMessage(data, portalThread?.sourceMessageId, portalThread?.type)
}

// ======= 门户线程显示消息 ======= //
// ============================= //

/**
 * 获取当前线程的父级消息
 * 用于在门户中显示
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 父级消息列表
 */
const portalDisplayParentMessages = s => {
  const data = messageSelectors.activeBaseChatsWithoutTool(s)

  return getTheadParentMessages(s, data)
}

/**
 * 获取指定线程ID的子消息
 * 这些消息是线程中的消息
 * 
 * @param {string} id - 线程ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回子消息列表
 */
const portalDisplayChildChatsByThreadId = id => s => {
  // 跳过工具消息
  const data = messageSelector.activeBaseChatsWithoutTool(s)

  return data.filter(m => !!id && m.threadId === id)
}

/**
 * 获取门户中显示的所有消息
 * 包括父消息、草稿消息和子消息
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 门户显示消息列表
 */
const portalDisplayChats = s => {
  const parentMessages = portalDisplayParentMessages(s)
  const afterMessages = portalDisplayChildChatsByThreadId(s.portalThreadId)(s)
  // 用于乐观更新
  const draftMessage = messageSelector
      .activeBaseChats(s)
      .find(m => m.threadId === THREAD_DRAFT_ID)

  return [...parentMessages, draftMessage, ...afterMessages].filter(Boolean)
}

/**
 * 获取门户显示消息的数量
 * 
 * @param {Object} s - 状态对象
 * @returns {number} 消息数量
 */
const portalDisplayChatsLength = s => {
  // 历史长度包括线程分隔符
  return portalDisplayChats(s).length
}

/**
 * 获取门户显示消息内容拼接成的字符串
 * 
 * @param {Object} s - 状态对象
 * @returns {string} 所有消息内容的拼接字符串
 */
const portalDisplayChatsString = s => {
  const messages = portalDisplayChats(s)

  return messages.map(m => m.content).join("")
}

/**
 * 获取门户显示消息的ID列表
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 消息ID列表
 */
const portalDisplayChatIDs = s => portalDisplayChats(s).map(i => i.id)

// ========= 门户线程AI消息 ========= //
// =============================== //

/**
 * 获取门户中AI父消息
 * 包括工具消息
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} AI父消息列表
 */
const portalAIParentMessages = s => {
  const data = messageSelector.activeBaseChats(s)

  return getTheadParentMessages(s, data)
}

/**
 * 获取指定线程ID的AI子消息
 * 
 * @param {string} id - 线程ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回AI子消息列表
 */
const portalAIChildChatsByThreadId = id => s => {
  // 包含工具消息
  const data = messageSelector.activeBaseChats(s)

  return data.filter(m => !!id && m.threadId === id)
}

/**
 * 获取门户中所有AI消息
 * 包括父消息和子消息
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} AI消息列表
 */
const portalAIChats = s => {
  const parentMessages = portalAIParentMessages(s)
  const afterMessages = portalAIChildChatsByThreadId(s.portalThreadId)(s)

  return [...parentMessages, ...afterMessages].filter(Boolean)
}

/**
 * 获取根据历史配置截取的门户AI消息列表
 * 使用代理的聊天配置来限制历史消息数量
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 根据配置截取后的消息列表
 */
const portalAIChatsWithHistoryConfig = s => {
  const parentMessages = portalAIParentMessages(s)
  const afterMessages = portalAIChildChatsByThreadId(s.portalThreadId)(s)

  const messages = [...parentMessages, ...afterMessages].filter(Boolean)

  const enableHistoryCount = agentChatConfigSelectors.enableHistoryCount(
      useAgentStore.getState()
  )
  const historyCount = agentChatConfigSelectors.historyCount(
      useAgentStore.getState()
  )

  return chatHelpers.getSlicedMessages(messages, {
    enableHistoryCount,
    historyCount
  })
}

/**
 * 获取线程源消息在显示消息中的索引
 * 
 * @param {Object} s - 状态对象
 * @returns {number} 源消息索引，如果未找到则返回-1
 */
const threadSourceMessageIndex = s => {
  const theadMessageId = threadSourceMessageId(s)
  const data = portalDisplayChats(s)

  return !theadMessageId ? -1 : data.findIndex(d => d.id === theadMessageId)
}

/**
 * 获取指定话题的线程列表
 * 
 * @param {string} topicId - 话题ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回线程列表
 */
const getThreadsByTopic = topicId => s => {
  if (!topicId) return

  return s.threadMaps[topicId]
}

/**
 * 获取指定源消息ID的第一个线程
 * 
 * @param {string} id - 源消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回线程对象
 */
const getFirstThreadBySourceMsgId = id => s => {
  const threads = currentTopicThreads(s)

  return threads.find(t => t.sourceMessageId === id)
}

/**
 * 获取指定源消息ID的所有线程
 * 
 * @param {string} id - 源消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回线程列表
 */
const getThreadsBySourceMsgId = id => s => {
  const threads = currentTopicThreads(s)

  return threads.filter(t => t.sourceMessageId === id)
}

/**
 * 判断指定源消息ID是否有线程
 * 
 * @param {string} id - 源消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回布尔值
 */
const hasThreadBySourceMsgId = id => s => {
  const threads = currentTopicThreads(s)

  return threads.some(t => t.sourceMessageId === id)
}

/**
 * 判断线程中AI是否正在生成回复
 * 检查当前门户显示的消息中是否有正在生成的消息
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否正在生成
 */
const isThreadAIGenerating = s =>
    s.chatLoadingIds.some(id => portalDisplayChatIDs(s).includes(id))

/**
 * 判断线程是否在RAG流程中
 * 检查当前门户显示的消息中是否有在RAG流程中的消息
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否在RAG流程中
 */
const isInRAGFlow = s =>
    s.messageRAGLoadingIds.some(id => portalDisplayChatIDs(s).includes(id))

/**
 * 判断是否正在创建线程消息
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否正在创建消息
 */
const isCreatingMessage = s => s.isCreatingThreadMessage

/**
 * 判断线程中是否有消息正在加载
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否有消息正在加载
 */
const isHasMessageLoading = s =>
    s.messageLoadingIds.some(id => portalDisplayChatIDs(s).includes(id))

/**
 * 判断线程发送按钮是否应该被禁用
 * 在以下情况下禁用：
 * 1. 有消息正在加载
 * 2. 正在创建线程
 * 3. 正在创建消息
 * 4. 消息在RAG流程中
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否禁用发送按钮
 */
const isSendButtonDisabledByMessage = s =>
    // 1. 当有消息正在加载时
    isHasMessageLoading(s) ||
    // 2. 当正在创建线程时
    s.isCreatingThread ||
    // 3. 当正在创建消息时
    isCreatingMessage(s) ||
    // 4. 当消息在RAG流程中时
    isInRAGFlow(s)

/**
 * 导出所有线程相关的选择器
 */
export const threadSelectors = {
  currentPortalThread,
  currentTopicThreads,
  getFirstThreadBySourceMsgId,
  getThreadsBySourceMsgId,
  getThreadsByTopic,
  hasThreadBySourceMsgId,
  isSendButtonDisabledByMessage,
  isThreadAIGenerating,
  portalAIChats,
  portalAIChatsWithHistoryConfig,
  portalDisplayChatIDs,
  portalDisplayChats,
  portalDisplayChatsLength,
  portalDisplayChatsString,
  portalDisplayChildChatsByThreadId,
  threadSourceMessageId,
  threadSourceMessageIndex,
  threadStartMessageId
}
