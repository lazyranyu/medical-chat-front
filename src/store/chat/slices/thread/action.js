/**
 * 聊天线程切片 - 动作
 * 
 * 定义了线程相关的状态更新动作
 * 包括线程的创建、更新、删除、消息发送等操作
 */

import isEqual from "fast-deep-equal" // 深度比较对象是否相等的工具
import { mutate } from "swr" // SWR的数据更新函数

import { chainSummaryTitle } from "@/chains/summaryTitle" // 线程标题摘要生成链
import { LOADING_FLAT, THREAD_DRAFT_ID } from "@/const/message" // 常量定义
import { useClientDataSWR } from "@/libs/swr" // 客户端数据SWR hook
import { chatService} from "@/api/chatService";
import { threadService } from "@/api/thread"
import { threadSelectors } from "@/store/chat/selectors" // 线程选择器
import { useUserStore } from "@/store/user" // 用户状态管理hook
import { systemAgentSelectors } from "@/store/user/selectors" // 系统代理选择器
import { merge } from "@/utils/merge" // 合并对象的工具函数
import { setNamespace } from "@/utils/storeDebug" // 设置调试命名空间的工具

import { threadReducer } from "./reducer" // 线程reducer

// 设置调试命名空间为"thd"
const n = setNamespace("thd")
// SWR获取线程的键
const SWR_USE_FETCH_THREADS = "SWR_USE_FETCH_THREADS"

/**
 * 创建线程切片
 * 定义了所有线程相关的动作
 * 
 * @param {Function} set - Zustand的set函数，用于更新状态
 * @param {Function} get - Zustand的get函数，用于获取当前状态
 * @returns {Object} 包含所有线程相关动作的对象
 */
export const chatThreadMessage = (set, get) => ({
  /**
   * 更新线程输入框消息内容
   * 
   * @param {string} message - 新的输入框内容
   */
  updateThreadInputMessage: message => {
    if (isEqual(message, get().threadInputMessage)) return

    set(
        { threadInputMessage: message },
        false,
        n(`updateThreadInputMessage`, message)
    )
  },

  /**
   * 打开线程创建器
   * 设置起始消息ID并打开门户
   * 
   * @param {string} messageId - 作为线程起点的消息ID
   */
  openThreadCreator: messageId => {
    set(
        {
          threadStartMessageId: messageId,
          portalThreadId: undefined,
          startToForkThread: true
        },
        false,
        "openThreadCreator"
    )
    get().togglePortal(true)
  },
  
  /**
   * 在门户中打开线程
   * 设置线程ID和源消息ID并打开门户
   * 
   * @param {string} threadId - 线程ID
   * @param {string} sourceMessageId - 源消息ID
   */
  openThreadInPortal: (threadId, sourceMessageId) => {
    set(
        {
          portalThreadId: threadId,
          threadStartMessageId: sourceMessageId,
          startToForkThread: false
        },
        false,
        "openThreadInPortal"
    )
    get().togglePortal(true)
  },

  /**
   * 关闭线程门户
   * 清除线程相关状态并关闭门户
   */
  closeThreadPortal: () => {
    set(
        {
          threadStartMessageId: undefined,
          portalThreadId: undefined,
          startToForkThread: undefined
        },
        false,
        "closeThreadPortal"
    )
    get().togglePortal(false)
  },
  
  /**
   * 发送线程消息
   * 在线程中创建新消息并触发AI回复
   * 
   * @param {Object} params - 参数对象
   * @param {string} params.message - 消息内容
   */
  sendThreadMessage: async ({ message }) => {
    const {
      internal_coreProcessMessage,
      activeTopicId,
      activeId,
      threadStartMessageId,
      newThreadMode,
      portalThreadId
    } = get()
    if (!activeId || !activeTopicId) return

    // 如果消息为空，则停止
    if (!message) return

    // 设置正在创建线程消息的状态
    set(
        { isCreatingThreadMessage: true },
        false,
        n("creatingThreadMessage/start")
    )

    // 创建新消息对象
    const newMessage = {
      content: message,
      // 如果消息附带文件，则添加文件到消息和代理
      // files: fileIdList,
      role: "user",
      // 如果有活动话题ID，则添加到消息中
      topicId: activeTopicId,
      threadId: portalThreadId
    }

    let parentMessageId = undefined
    let tempMessageId = undefined

    // 如果没有portalThreadId，则创建一个线程然后添加消息
    if (!portalThreadId) {
      if (!threadStartMessageId) return
      // 创建临时消息用于乐观更新
      tempMessageId = get().internal_createTmpMessage({
        ...newMessage,
        threadId: THREAD_DRAFT_ID
      })
      get().internal_toggleMessageLoading(true, tempMessageId)

      // 创建新线程
      const { threadId, messageId } = await get().createThread({
        message: newMessage,
        sourceMessageId: threadStartMessageId,
        topicId: activeTopicId,
        type: newThreadMode
      })

      parentMessageId = messageId

      // 刷新线程和消息
      await get().refreshThreads()
      await get().refreshMessages()

      // 在门户中打开新线程
      get().openThreadInPortal(threadId, threadStartMessageId)
    } else {
      // 如果已有线程，只需添加消息
      // 创建临时消息用于乐观更新
      tempMessageId = get().internal_createTmpMessage(newMessage)
      get().internal_toggleMessageLoading(true, tempMessageId)

      // 创建消息
      parentMessageId = await get().internal_createMessage(newMessage, {
        tempMessageId
      })
    }

    // 取消消息加载状态
    get().internal_toggleMessageLoading(false, tempMessageId)

    // 获取当前消息以生成AI回复
    const messages = threadSelectors.portalAIChats(get())

    // 处理消息，生成AI回复
    await internal_coreProcessMessage(messages, parentMessageId, {
      ragQuery: get().internal_shouldUseRAG() ? message : undefined,
      threadId: get().portalThreadId,
      inPortalThread: true
    })

    // 设置创建线程消息完成的状态
    set(
        { isCreatingThreadMessage: false },
        false,
        n("creatingThreadMessage/stop")
    )

    // 如果是新建线程，需要自动总结标题
    if (!portalThreadId) {
      const portalThread = threadSelectors.currentPortalThread(get())

      if (!portalThread) return

      const chats = threadSelectors.portalAIChats(get())
      await get().summaryThreadTitle(portalThread.id, chats)
    }
  },
  
  /**
   * 重新发送线程消息
   * 
   * @param {string} messageId - 要重新发送的消息ID
   */
  resendThreadMessage: async messageId => {
    const chats = threadSelectors.portalAIChats(get())

    await get().internal_resendMessage(messageId, {
      messages: chats,
      threadId: get().portalThreadId,
      inPortalThread: true
    })
  },
  
  /**
   * 删除并重新发送线程消息
   * 
   * @param {string} id - 要删除并重新发送的消息ID
   */
  delAndResendThreadMessage: async id => {
    get().resendThreadMessage(id)
    get().deleteMessage(id)
  },
  
  /**
   * 创建线程
   * 
   * @param {Object} params - 参数对象
   * @param {Object} params.message - 消息对象
   * @param {string} params.sourceMessageId - 源消息ID
   * @param {string} params.topicId - 话题ID
   * @param {string} params.type - 线程类型
   * @returns {Object} 包含新线程ID和消息ID的对象
   */
  createThread: async ({ message, sourceMessageId, topicId, type }) => {
    // 设置正在创建线程的状态
    set({ isCreatingThread: true }, false, n("creatingThread/start"))

    // 调用API创建线程和消息
    const data = await threadService.createThreadWithMessage({
      topicId,
      sourceMessageId,
      type,
      message
    })
    // 设置创建线程完成的状态
    set({ isCreatingThread: false }, false, n("creatingThread/end"))

    return data
  },

  /**
   * 使用SWR获取线程
   * 当启用时，会自动获取并更新线程列表
   * 
   * @param {boolean} enable - 是否启用
   * @param {string} topicId - 话题ID
   * @returns {Object} SWR响应对象
   */
  useFetchThreads: (enable, topicId) =>
      useClientDataSWR(
          enable && !!topicId
              ? [SWR_USE_FETCH_THREADS, topicId]
              : null,
          async ([, topicId]) => threadService.getThreads(topicId),
          {
            suspense: true,
            fallbackData: [],
            onSuccess: threads => {
              const nextMap = { ...get().threadMaps, [topicId]: threads }

              // 如果线程已初始化且映射没有变化，不需要更新
              if (get().topicsInit && isEqual(nextMap, get().topicMaps)) return

              set(
                  { threadMaps: nextMap, threadsInit: true },
                  false,
                  n("useFetchThreads(success)", { topicId })
              )
            }
          }
      ),

  /**
   * 刷新线程列表
   * 触发SWR重新获取数据
   * 
   * @returns {Promise} SWR重新验证的Promise
   */
  refreshThreads: async () => {
    const topicId = get().activeTopicId
    if (!topicId) return

    return mutate([SWR_USE_FETCH_THREADS, topicId])
  },
  
  /**
   * 删除线程
   * 
   * @param {string} id - 要删除的线程ID
   */
  removeThread: async id => {
    await threadService.removeThread(id)
    await get().refreshThreads()

    if (get().activeThreadId === id) {
      set({ activeThreadId: undefined })
    }
  },
  
  /**
   * 切换当前活动线程
   * 
   * @param {string} id - 要切换到的线程ID
   */
  switchThread: async id => {
    set({ activeThreadId: id }, false, n("toggleTopic"))
  },
  
  /**
   * 更新线程标题
   * 
   * @param {string} id - 线程ID
   * @param {string} title - 新标题
   */
  updateThreadTitle: async (id, title) => {
    await get().internal_updateThread(id, { title })
  },

  /**
   * 自动总结线程标题
   * 使用AI生成线程的标题摘要
   * 
   * @param {string} threadId - 线程ID
   * @param {Array} messages - 消息列表
   */
  summaryThreadTitle: async (threadId, messages) => {
    const {
      internal_updateThreadTitleInSummary,
      internal_updateThreadLoading
    } = get()
    const portalThread = threadSelectors.currentPortalThread(get())
    if (!portalThread) return

    // 设置加载中的标题
    internal_updateThreadTitleInSummary(threadId, LOADING_FLAT)

    let output = ""
    const threadConfig = systemAgentSelectors.thread(useUserStore.getState())

    // 获取预设任务结果（生成标题）
    chatService.fetchPresetTaskResult()
  },

  // 内部处理方法

  /**
   * 内部方法：在摘要过程中更新线程标题
   * 
   * @param {string} id - 线程ID
   * @param {string} title - 新标题
   */
  internal_updateThreadTitleInSummary: (id, title) => {
    get().internal_dispatchThread(
        { type: "updateThread", id, value: { title } },
        "updateThreadTitleInSummary"
    )
  },

  /**
   * 内部方法：更新线程加载状态
   * 
   * @param {string} id - 线程ID
   * @param {boolean} loading - 是否正在加载
   */
  internal_updateThreadLoading: (id, loading) => {
    set(
        state => {
          if (loading)
            return { threadLoadingIds: [...state.threadLoadingIds, id] }

          return {
            threadLoadingIds: state.threadLoadingIds.filter(i => i !== id)
          }
        },
        false,
        n("updateThreadLoading")
    )
  },

  /**
   * 内部方法：更新线程
   * 
   * @param {string} id - 线程ID
   * @param {Object} data - 要更新的数据
   */
  internal_updateThread: async (id, data) => {
    // 更新前端状态
    get().internal_dispatchThread({ type: "updateThread", id, value: data })

    // 设置加载状态
    get().internal_updateThreadLoading(id, true)
    // 更新数据库
    await threadService.updateThread(id, data)
    // 刷新线程列表
    await get().refreshThreads()
    // 取消加载状态
    get().internal_updateThreadLoading(id, false)
  },

  /**
   * 内部方法：分发线程动作
   * 使用reducer处理线程状态更新
   * 
   * @param {Object} payload - 包含动作类型和数据的载荷
   * @param {string} action - 动作名称，用于调试
   */
  internal_dispatchThread: (payload, action) => {
    // 使用reducer处理线程状态更新
    const nextThreads = threadReducer(
        threadSelectors.currentTopicThreads(get()),
        payload
    )
    // 创建新的线程映射
    const nextMap = { ...get().threadMaps, [get().activeTopicId]: nextThreads }

    // 如果映射没有变化，不需要更新
    if (isEqual(nextMap, get().threadMaps)) return

    // 更新状态
    set(
        { threadMaps: nextMap },
        false,
        action ?? n(`dispatchThread/${payload.type}`)
    )
  }
})
