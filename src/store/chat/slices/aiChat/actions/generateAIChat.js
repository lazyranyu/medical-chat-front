/**
 * AI聊天消息生成核心模块
 * 
 * 该模块负责处理AI聊天的核心功能，包括：
 * - 发送用户消息并生成AI回复
 * - 重新生成或删除并重新生成AI消息
 * - 处理聊天上下文和话题管理
 * - 集成RAG和其他增强功能
 * 
 * 这是AI聊天功能的主要实现模块，包含了消息处理的完整流程。
 */

import { produce } from "immer"
import { template } from "lodash-es"

import { LOADING_FLAT, MESSAGE_CANCEL_FLAT } from "@/const/message"
import { TraceEventType, TraceNameMap } from "@/const/trace"
import { chatService } from "@/api/chatService"
import { messageService} from "@/api/message";
import { useAgentStore } from "@/store/agent"
import { chatHelpers } from "@/store/chat/helpers"
import { messageMapKey } from "@/store/chat/utils/messageMapKey"
import { useSessionStore } from "@/store/session"
import { setNamespace } from "@/utils/storeDebug"

import { messageSelectors, topicSelectors } from "../../../selectors"
import {
  getAgentChatConfig,
  getAgentConfig,
  getAgentKnowledge
} from "./helpers"

// 设置调试命名空间
const n = setNamespace("ai")

/**
 * 生成AI聊天功能模块
 * 
 * @param {Function} set - Zustand状态设置函数
 * @param {Function} get - Zustand状态获取函数
 * @returns {Object} 包含AI聊天生成相关功能的对象
 */
export const generateAIChat = (set, get) => ({
  /**
   * 删除并重新生成消息
   * 
   * 删除指定消息并重新生成一个新的回复
   * 
   * @param {String} id - 要删除并重新生成的消息ID
   * @returns {Promise<void>}
   */
  delAndRegenerateMessage: async id => {
    const traceId = messageSelectors.getTraceIdByMessageId(id)(get())
    get().internal_resendMessage(id, { traceId })
    get().deleteMessage(id)

    // // 记录删除并重新生成消息的跟踪事件
    // get().internal_traceMessage(id, {
    //   eventType: TraceEventType.DeleteAndRegenerateMessage
    // })
  },

  /**
   * 重新生成消息
   * 
   * 保留原消息ID，重新生成内容
   * 
   * @param {String} id - 要重新生成的消息ID
   * @returns {Promise<void>}
   */
  regenerateMessage: async id => {
    const traceId = messageSelectors.getTraceIdByMessageId(id)(get())
    await get().internal_resendMessage(id, { traceId })

    // // 记录重新生成消息的跟踪事件
    // get().internal_traceMessage(id, {
    //   eventType: TraceEventType.RegenerateMessage
    // })
  },

  /**
   * 发送消息
   * 
   * 处理用户发送消息的主要函数，包括：
   * - 创建用户消息
   * - 自动创建话题（如果需要）
   * - 生成AI回复
   * 
   * @param {Object} options - 发送消息的选项
   * @param {String} options.message - 消息内容
   * @param {Array} options.files - 附加文件列表
   * @param {Boolean} options.onlyAddUserMessage - 是否只添加用户消息而不生成AI回复
   * @param {Boolean} options.isWelcomeQuestion - 是否是欢迎问题
   * @returns {Promise<void>}
   */
  sendMessage: async ({
                        message,
                        files,
                        onlyAddUserMessage,
                        isWelcomeQuestion
                      }) => {
    const {
      internal_coreProcessMessage,
      activeTopicId,
      activeId,
      activeThreadId
    } = get()
    if (!activeId) return

    const fileIdList = files?.map(f => f.id)

    const hasFile = !!fileIdList && fileIdList.length > 0

    // 如果消息为空且没有文件，则退出
    if (!message && !hasFile) return

    set({ isCreatingMessage: true }, false, n("creatingMessage/start"))

    const newMessage = {
      content: message,
      // 如果消息附带文件，则添加文件到消息和Agent
      files: fileIdList,
      role: "user",
      sessionId: activeId,
      // 如果有活跃话题ID，则添加到消息中
      topicId: activeTopicId,
      threadId: activeThreadId
    }

    const agentConfig = getAgentChatConfig()

    let tempMessageId = undefined
    let newTopicId = undefined

    // 如果是默认话题，且启用了自动创建话题功能，检查是否需要创建新话题
    if (
        !onlyAddUserMessage &&
        !activeTopicId &&
        agentConfig.enableAutoCreateTopic
    ) {
      // 检查活跃话题并自动创建话题
      const chats = messageSelectors.activeBaseChats(get())

      // 我们将添加两条消息（用户和助手），所以最终长度应该+2
      const featureLength = chats.length + 2

      // 如果没有活跃话题ID且特征长度大于阈值，则创建新话题并激活它
      if (
          !get().activeTopicId &&
          featureLength >= agentConfig.autoCreateTopicThreshold
      ) {
        // 创建临时消息用于乐观更新
        tempMessageId = get().internal_createTmpMessage(newMessage)
        get().internal_toggleMessageLoading(true, tempMessageId)

        const topicId = await get().createTopic()

        if (topicId) {
          newTopicId = topicId
          newMessage.topicId = topicId

          // 需要将消息复制到新话题，否则消息会消失
          const mapKey = messageSelectors.currentChatKey(get())
          const newMaps = {
            ...get().messagesMap,
            [messageMapKey(activeId, topicId)]: get().messagesMap[mapKey]
          }
          set({ messagesMap: newMaps }, false, n("moveMessagesToNewTopic"))

          // 设置话题为加载状态
          get().internal_updateTopicLoading(topicId, true)
        }
      }
    }
    // 更新助手状态以使其重新排序
    await useSessionStore.getState().triggerSessionUpdate(get().activeId)

    // 创建消息
    const id = get().internal_createMessage(newMessage, {
      tempMessageId,
      skipRefresh: !onlyAddUserMessage && newMessage.fileList?.length === 0
    })

    // 如果有临时消息ID，关闭其加载状态
    if (tempMessageId) get().internal_toggleMessageLoading(false, tempMessageId)

    // 如果创建了新话题，切换到新话题
    if (!!newTopicId) {
      await get().switchTopic(newTopicId, true)
      await get().internal_fetchMessages()

      // 删除之前的消息
      // 移除临时消息映射
      const newMaps = {
        ...get().messagesMap,
        [messageMapKey(activeId, null)]: []
      }
      set({ messagesMap: newMaps }, false, "internal_copyMessages")
    }

    // 如果只添加用户消息，则停止
    if (onlyAddUserMessage) {
      set({ isCreatingMessage: false }, false, "creatingMessage/start")
      return
    }

    // 获取当前消息以生成AI回复
    const messages = messageSelectors.activeBaseChats(get())
    const userFiles = messageSelectors.currentUserFiles(get()).map(f => f.id)

    // 处理消息生成AI回复
    await internal_coreProcessMessage(messages, id, {
      isWelcomeQuestion,
      ragQuery: get().internal_shouldUseRAG() ? message : undefined,
      threadId: activeThreadId
    })

    // 设置消息创建状态为false
    set({ isCreatingMessage: false }, false, n("creatingMessage/stop"))

    // 摘要话题标题函数
    const summaryTitle = async () => {
      // 如果自动创建话题功能关闭，则退出
      if (!agentConfig.enableAutoCreateTopic) return

      // 检查活跃话题并自动更新话题标题
      if (newTopicId) {
        const chats = messageSelectors.activeBaseChats(get())
        await get().summaryTopicTitle(newTopicId, chats)
        return
      }

      const topic = topicSelectors.currentActiveTopic(get())

      // 如果话题存在但没有标题，则生成标题
      if (topic && !topic.title) {
        const chats = messageSelectors.activeBaseChats(get())
        await get().summaryTopicTitle(topic.id, chats)
      }
    }

    // 将文件添加到Agent函数
    // 仅在服务器模式下可用
    const addFilesToAgent = async () => {
      if (userFiles.length === 0) return

      await useAgentStore.getState().addFilesToAgent(userFiles, false)
    }

    // 并行执行摘要标题和添加文件到Agent
    await Promise.all([summaryTitle(), addFilesToAgent()])
  },

  /**
   * 停止生成消息
   * 
   * 中断当前正在进行的AI消息生成过程
   */
  stopGenerateMessage: () => {
    const { abortController, internal_toggleChatLoading } = get()
    if (!abortController) return

    // 中止请求
    abortController.abort(MESSAGE_CANCEL_FLAT)

    // 关闭聊天加载状态
    internal_toggleChatLoading(false, undefined, n("stopGenerateMessage"))
  },

  // // 内部方法：AI消息处理核心方法（当前已注释）
  // internal_coreProcessMessage: async (
  //     originalMessages,
  //     userMessageId,
  //     params
  // ) => {
  // ... existing code ...
  // },

  /**
   * 内部方法：获取AI聊天消息
   * 
   * 该方法负责从AI服务获取回复，处理流式响应，并更新消息内容
   * 
   * @param {Array} messages - 消息历史列表
   * @param {String} assistantId - 助手消息ID
   * @param {Object} params - 参数对象
   * @returns {Promise<Object>} 包含函数调用信息和跟踪ID的对象
   */
  internal_fetchAIChatMessage: async (messages, assistantId, params) => {
    const {
      internal_toggleChatLoading,
      refreshMessages,
      internal_updateMessageContent,
      internal_dispatchMessage,
      internal_toggleToolCallingStreaming
    } = get()

    // 设置聊天加载状态并获取中止控制器
    const abortController = internal_toggleChatLoading(
        true,
        assistantId,
        n("generateMessage(start)", { assistantId, messages })
    )

    const agentConfig = getAgentConfig()
    const chatConfig = agentConfig.chatConfig

    // 创建模板编译器，用于处理输入模板
    const compiler = template(chatConfig.inputTemplate, {
      interpolate: /{{([\S\s]+?)}}/g
    })

    // ================================== //
    //   消息统一预处理                    //
    // ================================== //

    // 1. 根据配置切片消息
    let preprocessMsgs = chatHelpers.getSlicedMessagesWithConfig(
        messages,
        chatConfig,
        true
    )

    // 2. 替换输入消息模板
    preprocessMsgs = !chatConfig.inputTemplate
        ? preprocessMsgs
        : preprocessMsgs.map(m => {
          if (m.role === "user") {
            try {
              return { ...m, content: compiler({ text: m.content }) }
            } catch (error) {
              console.error(error)

              return m
            }
          }

          return m
        })

    // 3. 添加系统角色
    if (agentConfig.systemRole) {
      preprocessMsgs.unshift({
        content: agentConfig.systemRole,
        role: "system"
      })
    }

    // 4. 处理最大token数
    agentConfig.params.max_tokens = chatConfig.enableMaxTokens
        ? agentConfig.params.max_tokens
        : undefined

    let isFunctionCall = false
    let msgTraceId
    let output = ""

    // 获取当前活跃话题摘要
    const historySummary = topicSelectors.currentActiveTopicSummary(get())
    
    // 以下是调用聊天服务创建助手消息流的代码，当前已注释
    await chatService.createAssistantMessageStream({
      abortController,
      params: {
        messages: preprocessMsgs,
        model: agentConfig.model,
        provider: agentConfig.provider,
        ...agentConfig.params,
        plugins: agentConfig.plugins,
      },
      historySummary: historySummary?.content,
      trace: {
        traceId: params?.traceId,
        sessionId: get().activeId,
        topicId: get().activeTopicId,
        traceName: TraceNameMap.Conversation,
      },
      isWelcomeQuestion: params?.isWelcomeQuestion,
      onErrorHandle: async (error) => {
        await messageService.updateMessageError(assistantId, error);
        await refreshMessages();
      },
      onFinish: async (content, { traceId, observationId, toolCalls }) => {
        // if there is traceId, update it
        if (traceId) {
          msgTraceId = traceId;
          await messageService.updateMessage(assistantId, {
            traceId,
            observationId: observationId ?? undefined,
          });
        }

        if (toolCalls && toolCalls.length > 0) {
          internal_toggleToolCallingStreaming(assistantId, undefined);
        }

        // update the content after fetch result
        await internal_updateMessageContent(assistantId, content, toolCalls);
      },
      onMessageHandle: async (chunk) => {
        switch (chunk.type) {
          case 'text': {
            output += chunk.text;
            internal_dispatchMessage({
              id: assistantId,
              type: 'updateMessage',
              value: { content: output },
            });
            break;
          }

            // is this message is just a tool call
          case 'tool_calls': {
            internal_toggleToolCallingStreaming(assistantId, chunk.isAnimationActives);
            internal_dispatchMessage({
              id: assistantId,
              type: 'updateMessage',
              value: { tools: get().internal_transformToolCalls(chunk.tool_calls) },
            });
            isFunctionCall = true;
          }
        }
      },
    });

    // 关闭聊天加载状态
    internal_toggleChatLoading(false, assistantId, n("generateMessage(end)"))

    return {
      isFunctionCall,
      traceId: msgTraceId
    }
  },

  /**
   * 内部方法：重新发送消息
   * 
   * 用于重新生成消息时，构建上下文并重新发送请求
   * 
   * @param {String} messageId - 消息ID
   * @param {Object} options - 选项对象
   * @param {String} options.traceId - 跟踪ID
   * @param {Array} options.messages - 外部提供的消息列表
   * @param {String} options.threadId - 线程ID
   * @param {Boolean} options.inPortalThread - 是否在门户线程中
   * @returns {Promise<void>}
   */
  internal_resendMessage: async (
      messageId,
      { traceId, messages: outChats, threadId: outThreadId, inPortalThread } = {}
  ) => {
    // 1. 构造所有相关的历史记录
    const chats = outChats ?? messageSelectors.mainAIChats(get())

    // 查找当前消息的索引
    const currentIndex = chats.findIndex(c => c.id === messageId)
    if (currentIndex < 0) return

    const currentMessage = chats[currentIndex]

    let contextMessages = []

    // 根据消息角色构建上下文消息
    switch (currentMessage.role) {
      case "tool":
      case "user": {
        // 如果是工具或用户消息，取到当前消息为止的所有消息
        contextMessages = chats.slice(0, currentIndex + 1)
        break
      }
      case "assistant": {
        // 如果是AI助手消息，需要找到它的父用户消息
        const userId = currentMessage.parentId
        const userIndex = chats.findIndex(c => c.id === userId)
        // 如果消息没有parentId，则与user/tool模式相同
        contextMessages = chats.slice(
            0,
            userIndex < 0 ? currentIndex + 1 : userIndex + 1
        )
        break
      }
    }

    // 如果没有上下文消息，则退出
    if (contextMessages.length <= 0) return

    const { internal_coreProcessMessage, activeThreadId } = get()

    // 查找最后一条用户消息
    const latestMsg = contextMessages.findLast(s => s.role === "user")

    if (!latestMsg) return

    // 使用外部提供的线程ID或活跃线程ID
    const threadId = outThreadId ?? activeThreadId

    // 处理消息生成AI回复
    await internal_coreProcessMessage(contextMessages, latestMsg.id, {
      traceId,
      ragQuery: get().internal_shouldUseRAG() ? latestMsg.content : undefined,
      threadId,
      inPortalThread
    })
  },

  /**
   * 内部方法：切换聊天加载状态
   * 
   * @param {Boolean} loading - 是否正在加载
   * @param {String} id - 消息ID
   * @param {String} action - 动作描述
   * @returns {AbortController} 中止控制器
   */
  internal_toggleChatLoading: (loading, id, action) => {
    return get().internal_toggleLoadingArrays(
        "chatLoadingIds",
        loading,
        id,
        action
    )
  },
  
  /**
   * 内部方法：切换工具调用流状态
   * 
   * 管理工具调用的流式状态，用于UI动画显示
   * 
   * @param {String} id - 消息ID
   * @param {Boolean} streaming - 是否正在流式传输
   */
  internal_toggleToolCallingStreaming: (id, streaming) => {
    set(
        {
          toolCallingStreamIds: produce(get().toolCallingStreamIds, draft => {
            if (!!streaming) {
              draft[id] = streaming
            } else {
              delete draft[id]
            }
          })
        },
        false,
        "toggleToolCallingStreaming"
    )
  }
})
