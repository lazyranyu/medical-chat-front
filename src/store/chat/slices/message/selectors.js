/**
 * 聊天消息切片 - 选择器
 * 
 * 定义了用于从状态中提取消息相关数据的选择器函数
 * 这些选择器用于在组件中访问和过滤消息数据
 */

import { DEFAULT_USER_AVATAR } from "@/const/meta" // 默认用户头像常量
import { INBOX_SESSION_ID } from "@/const/session" // 收件箱会话ID常量
import { useAgentStore } from "@/store/agent" // 代理状态管理hook
import { agentSelectors } from "@/store/agent/selectors" // 代理选择器
import { messageMapKey } from "@/store/chat/utils/messageMapKey" // 消息映射键生成工具
import { useUserStore } from "@/store/user" // 用户状态管理hook
import { userProfileSelectors } from "@/store/user/selectors" // 用户资料选择器

import { chatHelpers } from "../../helpers" // 聊天辅助函数

/**
 * 获取消息的元数据（如头像）
 * 根据消息的角色返回不同的元数据
 * 
 * @param {Object} message - 消息对象
 * @returns {Object} 包含头像等元数据的对象
 */
const getMeta = message => {
  let meta = {
    avatar: DEFAULT_USER_AVATAR,
    title: message.role === 'user' ? '用户' : '助手',
  };
  
  switch (message.role) {
    case "user": {
      // 用户消息使用用户头像或默认头像
      return {
        ...meta,
        avatar: userProfileSelectors.userAvatar(useUserStore.getState()) || DEFAULT_USER_AVATAR,
        title: '用户'
      }
    }

    case "assistant": {
      // 助手消息
      return {
        ...meta,
        title: '助手'
      }
    }

    case "system": {
      // 系统消息使用消息自带的元数据
      // 确保系统消息的meta至少包含title属性
      return message.meta ? { ...meta, ...message.meta } : meta;
    }
    
    default:
      // 确保所有其他角色都有默认元数据
      return meta;
  }
}

/**
 * 获取当前聊天的消息映射键
 * 由会话ID和话题ID组合而成
 *
 * @param {import('@/store/chat').ChatState} s - 状态对象
 * @returns {string} 消息映射键
 */
const currentChatKey = s => {
  return messageMapKey(s.activeTopicId)
}

/**
 * 获取当前活动的原始消息列表，包括线程消息
 * 为每个消息添加元数据
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 消息列表
 */
const activeBaseChats = s => {
  if (!s.activeId) return [] // 如果没有活动会话ID，返回空数组

  // 获取当前会话和话题的消息
  const messages = s.messagesMap[currentChatKey(s)] || []
  console.log('activeBaseChats',messages)
  // 为每个消息添加元数据
  return messages.map(i => ({ ...i, meta: getMeta(i) }))
}

/**
 * 获取不包含工具消息的活动消息列表
 * 在UI展示时使用，过滤掉role为tool的消息
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 过滤后的消息列表
 */
const activeBaseChatsWithoutTool = s => {
  const messages = activeBaseChats(s)
  console.log('activeBaseChatsWithoutTool',messages)

  return messages.filter(m => m.role !== "tool")
}

/**
 * 根据线程ID获取消息
 * 如果有活动线程ID，则返回主消息和该线程的消息
 * 否则只返回主消息（没有threadId的消息）
 * 
 * @param {Object} s - 状态对象
 * @param {Array} messages - 消息列表
 * @returns {Array} 根据线程过滤后的消息列表
 */
const getChatsWithThread = (s, messages) => {
  // 如果没有活动线程ID，则返回所有的主消息（没有threadId的消息）
  if (!s.activeThreadId) return messages.filter(m => !m.threadId)

  // 查找当前活动线程
  const thread = s.threadMaps[s.activeTopicId]?.find(
      t => t.id === s.activeThreadId
  )

  // 如果找不到线程，返回主消息
  if (!thread) return messages.filter(m => !m.threadId)

  // 找到源消息的索引（线程的起点消息）
  const sourceIndex = messages.findIndex(m => m.id === thread.sourceMessageId)
  // 截取到源消息为止的所有消息
  const sliced = messages.slice(0, sourceIndex + 1)

  // 返回主消息和当前线程的消息
  return [...sliced, ...messages.filter(m => m.threadId === s.activeThreadId)]
}

// ============= 主要显示消息 ========== //
// ================================== //

/**
 * 获取主要显示的消息列表
 * 这是UI中实际显示的消息，已过滤掉工具消息并根据线程进行了筛选
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 显示用的消息列表
 */
const mainDisplayChats = s => {
  const displayChats = activeBaseChatsWithoutTool(s)

  return getChatsWithThread(s, displayChats)
}

/**
 * 获取主要显示消息的ID列表
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 消息ID列表
 */
const mainDisplayChatIDs = s =>{
  console.log( 'mainDisplayChatIDs',mainDisplayChats(s).map(s => s.id))
  return mainDisplayChats(s).map(s => s.id)
}

/**
 * 获取主要AI消息列表
 * 包括所有消息（包括工具消息），并根据线程进行了筛选
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} AI消息列表
 */
const mainAIChats = s => {
  const messages = activeBaseChats(s)

  return getChatsWithThread(s, messages)
}

/**
 * 获取根据历史配置截取的AI消息列表
 * 使用代理的聊天配置来限制历史消息数量
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 根据配置截取后的消息列表
 */
const mainAIChatsWithHistoryConfig = s => {
  const chats = mainAIChats(s)
  const config = agentSelectors.currentAgentChatConfig(useAgentStore.getState())

  return chatHelpers.getSlicedMessagesWithConfig(chats, config)
}

/**
 * 获取所有AI消息内容拼接成的字符串
 * 
 * @param {Object} s - 状态对象
 * @returns {string} 所有消息内容的拼接字符串
 */
const mainAIChatsMessageString = s => {
  const chats = mainAIChatsWithHistoryConfig(s)
  return chats.map(m => m.content).join("")
}

/**
 * 获取当前的工具消息列表
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 工具消息列表
 */
const currentToolMessages = s => {
  const messages = activeBaseChats(s)

  return messages.filter(m => m.role === "tool")
}

/**
 * 获取当前的用户消息列表
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 用户消息列表
 */
const currentUserMessages = s => {
  const messages = activeBaseChats(s)

  return messages.filter(m => m.role === "user")
}

/**
 * 获取当前用户上传的所有文件
 * 从用户消息中提取文件列表
 * 
 * @param {Object} s - 状态对象
 * @returns {Array} 文件列表
 */
const currentUserFiles = s => {
  const userMessages = currentUserMessages(s)

  return userMessages
      .filter(m => m.fileList && m.fileList?.length > 0)
      .flatMap(m => m.fileList)
      .filter(Boolean)
}

/**
 * 判断是否显示收件箱欢迎信息
 * 当在收件箱且没有消息时显示
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否显示欢迎信息
 */
const showInboxWelcome = s => {
  const isInbox = s.activeId === INBOX_SESSION_ID
  if (!isInbox) return false

  const data = activeBaseChats(s)
  return data.length === 0
}

/**
 * 根据ID获取消息
 * 
 * @param {string} id - 消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回指定ID的消息
 */
const getMessageById = id => s =>
    chatHelpers.getMessageById(activeBaseChats(s), id)

/**
 * 计算指定线程ID的消息数量
 * 
 * @param {string} id - 线程ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回消息数量
 */
const countMessagesByThreadId = id => s => {
  const messages = activeBaseChats(s).filter(m => m.threadId === id)

  return messages.length
}

/**
 * 根据工具调用ID获取消息
 * 
 * @param {string} id - 工具调用ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回指定工具调用ID的消息
 */
const getMessageByToolCallId = id => s => {
  const messages = activeBaseChats(s)
  return messages.find(m => m.tool_call_id === id)
}

/**
 * 获取最新的消息
 * 
 * @param {Object} s - 状态对象
 * @returns {Object|undefined} 最新的消息对象
 */
const latestMessage = s => activeBaseChats(s).at(-1)

/**
 * 获取当前聊天的加载状态
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否正在加载
 */
const currentChatLoadingState = s => !s.messagesInit

/**
 * 判断当前聊天是否已加载
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否已加载
 */
const isCurrentChatLoaded = (s) =>{
  console.log("isCurrentChatLoaded",currentChatKey(s))
  return  !!s.messagesMap[currentChatKey(s)]
}

/**
 * 判断指定消息是否正在编辑
 * 
 * @param {string} id - 消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回是否正在编辑
 */
const isMessageEditing = id => s => s.messageEditingIds && Array.isArray(s.messageEditingIds) && s.messageEditingIds.includes(id)

/**
 * 判断指定消息是否正在加载
 * 
 * @param {string} id - 消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回是否正在加载
 */
const isMessageLoading = id => s => s.messageLoadingIds && Array.isArray(s.messageLoadingIds) && s.messageLoadingIds.includes(id)

/**
 * 判断指定消息是否正在生成
 * 
 * @param {string} id - 消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回是否正在生成
 */
const isMessageGenerating = id => s => s.chatLoadingIds && Array.isArray(s.chatLoadingIds) && s.chatLoadingIds.includes(id)

/**
 * 判断指定消息是否在RAG流程中
 * RAG: Retrieval-Augmented Generation，检索增强生成
 * 
 * @param {string} id - 消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回是否在RAG流程中
 */
const isMessageInRAGFlow = id => s => s.messageRAGLoadingIds && Array.isArray(s.messageRAGLoadingIds) && s.messageRAGLoadingIds.includes(id)

/**
 * 判断指定消息的插件API是否正在调用
 * 
 * @param {string} id - 消息ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回插件API是否正在调用
 */
const isPluginApiInvoking = id => s => s.pluginApiLoadingIds && Array.isArray(s.pluginApiLoadingIds) && s.pluginApiLoadingIds.includes(id)

/**
 * 判断指定工具调用是否正在流式传输
 * 
 * @param {string} id - 消息ID
 * @param {number} index - 工具调用索引
 * @returns {Function} 返回一个接收状态的函数，该函数返回是否正在流式传输
 */
const isToolCallStreaming = (id, index) => s => {
  const isLoading = s.toolCallingStreamIds[id]

  if (!isLoading) return false

  return isLoading[index]
}

/**
 * 判断AI是否正在生成回复
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否正在生成
 */
const isAIGenerating = s => {
  const displayChatIDs = mainDisplayChatIDs(s);
  console.log("isAIGenerating",displayChatIDs)
  return  s.chatLoadingIds && s.chatLoadingIds.some(id => mainDisplayChatIDs(s).includes(id))
}

/**
 * 判断是否在RAG流程中
 * 检查当前显示的消息中是否有在RAG流程中的消息
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否在RAG流程中
 */
const isInRAGFlow = s =>
   s.messageRAGLoadingIds && s.messageRAGLoadingIds.some(id => mainDisplayChatIDs(s).includes(id))

/**
 * 判断是否正在创建消息
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否正在创建消息
 */
const isCreatingMessage = s => s.isCreatingMessage

/**
 * 判断是否有消息正在加载
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否有消息正在加载
 */
const isHasMessageLoading = s =>
    s.messageLoadingIds.some(id => mainDisplayChatIDs(s).includes(id))

/**
 * 判断发送按钮是否应该被禁用
 * 在以下情况下禁用：
 * 1. 有消息正在加载
 * 2. 正在创建话题
 * 3. 正在创建消息
 * 4. 消息在RAG流程中
 * 
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否禁用发送按钮
 */
const isSendButtonDisabledByMessage = s =>
    // 1. 当有消息正在加载时
    isHasMessageLoading(s) ||
    // 2. 当正在创建话题时
    s.creatingTopic ||
    // 3. 当正在创建消息时
    isCreatingMessage(s)

/**
 * 导出所有消息相关的选择器
 */
export const messageSelectors = {
  activeBaseChats,
  activeBaseChatsWithoutTool,
  countMessagesByThreadId,
  currentChatKey,
  currentChatLoadingState,
  currentToolMessages,
  currentUserFiles,
  getMessageById,
  getMessageByToolCallId,
  latestMessage,
  mainAIChats,
  mainAIChatsMessageString,
  mainAIChatsWithHistoryConfig,
  mainDisplayChatIDs,
  mainDisplayChats,
  showInboxWelcome,
  isAIGenerating,
  isCreatingMessage,
  isCurrentChatLoaded,
  isHasMessageLoading,
  isMessageEditing,
  isMessageGenerating,
  isMessageInRAGFlow,
  isMessageLoading,
  isPluginApiInvoking,
  isSendButtonDisabledByMessage,
  isToolCallStreaming
}
