/**
 * 聊天消息切片 - 动作
 * 
 * 定义了消息相关的状态更新动作
 * 包括消息的创建、删除、更新、复制等操作
 */

// Disable the auto sort key eslint rule to make the code more logic and readable
import { copyToClipboard } from "@lobehub/ui"
import isEqual from "fast-deep-equal"
import { mutate } from "swr"

import { useClientDataSWR } from "@/libs/swr"
import { messageService} from "@/api/message";
import { topicService} from "@/api/topic";
import { setNamespace } from "@/utils/storeDebug"
import { nanoid } from "@/utils/uuid"

import { messageSelectors } from "../../selectors"
import { preventLeavingFn, toggleBooleanList } from "../../utils"
import { messagesReducer } from "./reducer"
import {messageMapKey} from "@/store/chat/utils/messageMapKey";

const n = setNamespace("m")

const SWR_USE_FETCH_MESSAGES = "SWR_USE_FETCH_MESSAGES"

/**
 * 创建消息切片
 * 定义了所有消息相关的动作
 * 
 * @param {Function} set - Zustand的set函数，用于更新状态
 * @param {Function} get - Zustand的get函数，用于获取当前状态
 * @returns {Object} 包含所有消息相关动作的对象
 */
// 在顶部定义更语义化的 key 生成器
const genMessagesKey = (topicId) => [SWR_USE_FETCH_MESSAGES,  topicId];

export const createMessageSlice = (set, get) => ({
  /**
   * 删除指定ID的消息
   * 如果消息包含工具调用，会同时删除相关的工具消息
   * 
   * @param {string} id - 要删除的消息ID
   */
  deleteMessage: async id => {
    const message = messageSelectors.getMessageById(id)(get())
    if (!message) return

    let ids = [message.id]

    // 如果消息包含工具调用，则删除所有相关消息
    if (message.tools) {
      const toolMessageIds = message.tools.flatMap(tool => {
        const messages = messageSelectors
            .activeBaseChats(get())
            .filter(m => m.tool_call_id === tool.id)

        return messages.map(m => m.id)
      })
      ids = ids.concat(toolMessageIds)
    }

    get().internal_dispatchMessage({ type: "deleteMessages", ids })
    await messageService.removeMessages(ids)
    await get().refreshMessages()
  },

  /**
   * 删除工具消息
   * 同时从助手消息中移除对应的工具项
   * 
   * @param {string} id - 要删除的工具消息ID
   */
  deleteToolMessage: async id => {
    const message = messageSelectors.getMessageById(id)(get())
    if (!message || message.role !== "tool") return

    const removeToolInAssistantMessage = async () => {
      if (!message.parentId) return
      await get().internal_removeToolToAssistantMessage(
          message.parentId,
          message.tool_call_id
      )
    }

    await Promise.all([
      // 1. 删除工具消息
      get().internal_deleteMessage(id),
      // 2. 从助手消息中移除工具项
      removeToolInAssistantMessage()
    ])
  },

  /**
   * 清空当前会话的所有消息
   * 如果有活动话题，也会删除该话题
   */
  clearMessage: async () => {
    const {
      activeId,
      activeTopicId,
      refreshMessages,
      refreshTopic,
      switchTopic
    } = get()

    await messageService.removeMessagesByAssistant(activeId, activeTopicId)

    if (activeTopicId) {
      await topicService.removeTopic(activeTopicId)
    }
    await refreshTopic()
    await refreshMessages()

    // 删除话题后，切换回默认话题
    switchTopic()
  },
  
  /**
   * 清空所有消息
   * 删除数据库中的所有消息记录
   */
  clearAllMessages: async () => {
    const { refreshMessages } = get()
    await messageService.removeAllMessages()
    await refreshMessages()
  },
  
  /**
   * 添加AI消息
   * 使用当前输入框的内容创建一条助手消息
   */
  addAIMessage: async () => {
    const {
      internal_createMessage,
      updateInputMessage,
      activeTopicId,
      activeId,
      inputMessage
    } = get()
    if (!activeId) return

    await internal_createMessage({
      content: inputMessage,
      role: "assistant",
      // 如果有活动话题ID，则添加到消息中
      topicId: activeTopicId
    })

    updateInputMessage("")
  },
  
  /**
   * 复制消息内容
   * 并记录复制事件
   * 
   * @param {string} id - 消息ID
   * @param {string} content - 要复制的内容
   */
  copyMessage: async (id, content) => {
    await copyToClipboard(content)
  },
  
  /**
   * 切换消息编辑状态
   * 
   * @param {string} id - 消息ID
   * @param {boolean} editing - 是否处于编辑状态
   */
  toggleMessageEditing: (id, editing) => {
    set(
        {
          messageEditingIds: toggleBooleanList(
              get().messageEditingIds,
              id,
              editing
          )
        },
        false,
        "toggleMessageEditing"
    )
  },

  /**
   * 更新输入框消息内容
   * 
   * @param {string} message - 新的输入框内容
   */
  updateInputMessage: message => {
    if (isEqual(message, get().inputMessage)) return

    set({ inputMessage: message }, false, n("updateInputMessage", message))
  },
  
  /**
   * 修改消息内容
   * 并记录修改事件
   * 
   * @param {string} id - 消息ID
   * @param {string} content - 新的消息内容
   */
  modifyMessageContent: async (id, content) => {
    await get().internal_updateMessageContent(id, content)
  },
  
  /**
   * 使用SWR获取消息
   * 当启用时，会自动获取并更新消息列表
   *
   * @param {string} activeTopicId - 活动话题ID
   * @returns {Object} SWR响应对象
   */
  useFetchMessages: ( activeTopicId) => {
    // useClientDataSWR返回一个函数，需要执行这个函数才能触发SWR
    useClientDataSWR(
        genMessagesKey( activeTopicId),
        async ([, topicId]) =>
            messageService.getMessages(topicId),
        {
          onSuccess: (messages, key) => {
            const nextMap = {
              ...get().messagesMap,
              [messageMapKey(activeTopicId)]: messages
            }
            console.log("useFetchMessages(success)", nextMap )
            // 如果消息已初始化且映射没有变化，不需要更新
            if (get().messagesInit && isEqual(nextMap, get().messagesMap)) return

            set(
                { messagesInit: true, messagesMap: nextMap },
                false,
                n("useFetchMessages", { messages, queryKey: key })
            )
          }
        }
    )()  // 添加括号执行返回的函数
  },

  /**
   * 刷新消息列表
   * 触发SWR重新获取数据
   */
  refreshMessages: async () => {
    await mutate([SWR_USE_FETCH_MESSAGES, get().activeId, get().activeTopicId])
  },

  /**
   * 内部方法：分发消息动作
   * 使用reducer处理消息状态更新
   * 
   * @param {Object} payload - 包含动作类型和数据的载荷
   */
  internal_dispatchMessage: payload => {
    const { activeId } = get()

    if (!activeId) return

    const messages = messagesReducer(
        messageSelectors.activeBaseChats(get()),
        payload
    )

    const nextMap = {
      ...get().messagesMap,
      [messageSelectors.currentChatKey(get())]: messages
    }

    if (isEqual(nextMap, get().messagesMap)) return

    // 检查是否需要立即更新（用于流式响应）
    const isImmediate = payload.immediate === true
    
    set({ messagesMap: nextMap }, false, {
      type: `dispatchMessage/${payload.type}`,
      payload,
      // 添加立即更新标志
      immediate: isImmediate
    })
  },

  /**
   * 内部方法：更新消息错误
   * 
   * @param {string} id - 消息ID
   * @param {Object} error - 错误信息
   */
  internal_updateMessageError: async (id, error) => {
    get().internal_dispatchMessage({
      id,
      type: "updateMessage",
      value: { error }
    })
    await messageService.updateMessage(id, { error })
    await get().refreshMessages()
  },
  
  /**
   * 内部方法：更新消息内容
   * 
   * @param {string} id - 消息ID
   * @param {string} content - 新的消息内容
   * @param {Array} toolCalls - 工具调用数据
   */
  internal_updateMessageContent: async (id, content) => {
    const {
      internal_dispatchMessage,
      refreshMessages,
    } = get()

    // 立即更新UI显示，标记为立即更新
    internal_dispatchMessage({
      id,
      type: "updateMessage",
      value: { content },
      immediate: true
    })

    // 后台更新数据库，不阻塞UI
    // 使用Promise.resolve().then()将数据库更新移到下一个微任务队列
    Promise.resolve().then(async () => {
      await messageService.updateMessage(id, content);
      // 使用较低优先级刷新消息，避免阻塞UI
      setTimeout(() => {
        refreshMessages();
      }, 0);
    });
  },

  /**
   * 内部方法：创建消息
   * 
   * @param {Object} message - 消息数据
   * @param {Object} context - 上下文信息
   * @returns {string} 创建的消息ID
   */
  internal_createMessage: async (message, context) => {
    const {
      internal_createTmpMessage,
      refreshMessages,
      internal_toggleMessageLoading,
    } = get()
    let tempId = context?.tempMessageId

    if (!tempId) {
      // 使用乐观更新避免等待
      tempId = internal_createTmpMessage(message)

      internal_toggleMessageLoading(true, tempId)
    }

    const id = await messageService.createMessage(message)

    if (!context?.skipRefresh) {
      internal_toggleMessageLoading(true, tempId)
      await refreshMessages()
    }

    internal_toggleMessageLoading(false, tempId)

    return id
  },

  /**
   * 内部方法：获取消息列表
   * 直接从API获取消息并更新状态
   */
  internal_fetchMessages: async () => {
    const messages = await messageService.getMessages(
        get().activeTopicId
    )
    const nextMap = {
      ...get().messagesMap,
      [messageSelectors.currentChatKey(get())]: messages
    }
    // 如果消息已初始化且映射没有变化，不需要更新
    if (get().messagesInit && isEqual(nextMap, get().messagesMap)) return

    set(
        { messagesInit: true, messagesMap: nextMap },
        false,
        n("internal_fetchMessages", { messages })
    )
  },
  
  /**
   * 内部方法：创建临时消息
   * 用于乐观更新，在API响应前先在UI中显示消息
   * 
   * @param {Object} message - 消息数据
   * @returns {string} 临时消息ID
   */
  internal_createTmpMessage: message => {
    const { internal_dispatchMessage } = get()

    // 使用乐观更新避免等待
    const tempId = "tmp_" + nanoid()
    internal_dispatchMessage({
      type: "createMessage",
      id: tempId,
      value: message
    })

    return tempId
  },
  
  /**
   * 内部方法：删除消息
   * 
   * @param {string} id - 要删除的消息ID
   */
  internal_deleteMessage: async id => {
    get().internal_dispatchMessage({ type: "deleteMessage", id })
    await messageService.removeMessage(id)
    await get().refreshMessages()
  },
  
  // ----- 加载状态管理 ------- //
  
  /**
   * 内部方法：切换消息加载状态
   * 
   * @param {boolean} loading - 是否正在加载
   * @param {string} id - 消息ID
   */
  internal_toggleMessageLoading: (loading, id) => {
    set(
        {
          messageLoadingIds: toggleBooleanList(
              get().messageLoadingIds,
              id,
              loading
          )
        },
        false,
        "internal_toggleMessageLoading"
    )
  },
  
  /**
   * 内部方法：切换加载数组状态
   * 通用方法，用于管理各种加载状态数组
   * 
   * @param {string} key - 状态键名
   * @param {boolean} loading - 是否正在加载
   * @param {string} id - 项目ID
   * @param {string} action - 动作名称，用于调试
   * @returns {AbortController|undefined} 如果是加载状态，返回中止控制器
   */
  internal_toggleLoadingArrays: (key, loading, id, action) => {
    if (loading) {
      // 添加页面离开前的提示
      window.addEventListener("beforeunload", preventLeavingFn)

      // 创建中止控制器，用于取消请求
      const abortController = new AbortController()
      set(
          {
            abortController,
            [key]: toggleBooleanList(get()[key], id, loading)
          },
          false,
          action
      )

      return abortController
    } else {
      if (!id) {
        // 如果没有ID，清空整个数组
        set({ abortController: undefined, [key]: [] }, false, action)
      } else
        // 否则只移除指定ID
        set(
            {
              abortController: undefined,
              [key]: toggleBooleanList(get()[key], id, loading)
            },
            false,
            action
        )

      // 移除页面离开前的提示
      window.removeEventListener("beforeunload", preventLeavingFn)
    }
  },

  /**
   * 内部方法：转换工具调用
   * 
   * 这是一个空实现，用于保持代码兼容性，实际功能已被移除
   */
  internal_transformToolCalls: () => {
    // 空实现，功能已被移除
    return [];
  },

  /**
   * 内部方法：从助手消息中移除工具项
   * 
   * 这是一个空实现，用于保持代码兼容性，实际功能已被移除
   */
  internal_removeToolToAssistantMessage: async () => {
    // 空实现，功能已被移除
  },

  /**
   * 重新调用工具消息
   * 
   * 这是一个空实现，用于保持代码兼容性，实际功能已被移除
   */
  reInvokeToolMessage: async () => {
    // 空实现，功能已被移除
  },
})
