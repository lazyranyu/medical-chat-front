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
import { chatService } from "@/api/chatService"
import { messageService} from "@/api/message";
import { useAgentStore } from "@/store/agent"
import { chatHelpers } from "@/store/chat/helpers"
import { messageMapKey } from "@/store/chat/utils/messageMapKey"
import { setNamespace } from "@/utils/storeDebug"
import { optimizedDebounce } from "@/store/chat/utils"

import { messageSelectors, topicSelectors } from "../../../selectors"
import {
  getAgentChatConfig,
  getAgentConfig,
  getAgentKnowledge
} from "./helpers"
import {DEFAULT_AGENT_CHAT_CONFIG} from "@/const/settings";
import {useChatStore} from "@/store/chat";

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
    get().internal_resendMessage(id, {})
    get().deleteMessage(id)
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
    await get().internal_resendMessage(id, {})
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
    console.log("sendMessage11", message, files)
    set({ isCreatingMessage: true }, false, n("creatingMessage/start"))

    const newMessage = {
      content: message,
      // 如果消息附带文件，则添加文件到消息和Agent
      files: fileIdList,
      role: "user",
      // 如果有活跃话题ID，则添加到消息中
      topicId: activeTopicId,
      threadId: activeThreadId
    }
    console.log('sendMessage1', newMessage);
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

    // 创建消息
    const [id] = await Promise.all([get().internal_createMessage(newMessage, {
      tempMessageId,
      skipRefresh: !onlyAddUserMessage && newMessage.fileList?.length === 0
    })])
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
      // ragQuery: get().internal_shouldUseRAG() ? message : undefined,
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
        await get().summaryTopicTitle(newTopicId)
        return
      }

      const topic = topicSelectors.currentActiveTopic(get())

      // 如果话题存在但没有标题，则生成标题
      if (topic && !topic.title) {
        await get().summaryTopicTitle(topic.id)
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
  internal_coreProcessMessage: async (originalMessages, userMessageId, params) => {
    const { internal_fetchAIChatMessage, refreshMessages, activeTopicId } = get();

    // 创建新数组避免修改原消息数组
    const messages = [...originalMessages];

    const { model, provider, chatConfig } = getAgentConfig();

    let fileChunks;
    let ragQueryId;

    // // 如果包含RAG查询标记，进入RAG流程
    // if (params?.ragQuery) {
    //   // 1. 从语义搜索获取相关文本块
    //   const { chunks, queryId, rewriteQuery } = await get().internal_retrieveChunks(
    //       userMessageId,
    //       params?.ragQuery,
    //       messages.map((m) => m.content).slice(0, messages.length - 1)
    //   );
    //
    //   ragQueryId = queryId;
    //
    //   const lastMsg = messages.pop();
    //
    //   // 2. 构建检索上下文消息
    //   const knowledgeBaseQAContext = knowledgeBaseQAPrompts({
    //     chunks,
    //     userQuery: lastMsg.content,
    //     rewriteQuery,
    //     knowledge: getAgentKnowledge()
    //   });
    //
    //   // 3. 将检索上下文添加到消息历史
    //   messages.push({
    //     ...lastMsg,
    //     content: (lastMsg.content + '\n\n' + knowledgeBaseQAContext).trim()
    //   });
    //
    //   fileChunks = chunks.map((c) => ({ id: c.id, similarity: c.similarity }));
    // }

    // 2. 添加占位用的空助手消息
    const assistantMessage = {
      role: 'assistant',
      content: LOADING_FLAT,
      model: model,
      provider: provider,

      parentId: userMessageId,
      sessionId: get().activeId,
      topicId: activeTopicId,
      threadId: params?.threadId,
    };

    // 异步创建助手消息
    const assistantId = await get().internal_createMessage(assistantMessage);
    console.log('internal_createMessage', assistantId)
    // 3. 获取AI响应
    await internal_fetchAIChatMessage(messages, assistantId, params);
    await refreshMessages();
    // 5. 当上下文消息超过历史限制时进行摘要
    const historyCount =
        chatConfig.historyCount || DEFAULT_AGENT_CHAT_CONFIG.historyCount;

    if (
        chatConfig.enableHistoryCount &&
        chatConfig.enableCompressHistory &&
        originalMessages.length > historyCount
    ) {
      const historyMessages = originalMessages.slice(0, -historyCount + 1);
      await get().internal_summaryHistory(historyMessages);
    }
  },


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

    let output = ""

    // 获取当前活跃话题摘要
    const historySummary = topicSelectors.currentActiveTopicSummary(get())
    
    // 以下是调用聊天服务创建助手消息流的代码
    await chatService.createAssistantMessageStream({
      abortController,
      params: {
        messages: preprocessMsgs,
        model: agentConfig.model,
        provider: agentConfig.provider,
        ...agentConfig.params,
        plugins: agentConfig.plugins,
        // 禁用工具调用功能
        function_call: "none",
        tools: [],
      },
      historySummary: historySummary?.content,
      isWelcomeQuestion: params?.isWelcomeQuestion,
      onErrorHandle: async (error) => {
        console.error("AI聊天消息生成错误:", error);
        // 更新消息显示错误信息
        await messageService.updateMessageError(assistantId, {
          message: "生成回复时出错，请稍后重试",
          details: error.message || "未知错误"
        });
        await refreshMessages();
      },
      onFinish: async (content) => {
        await internal_updateMessageContent(assistantId, content);
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
        }
      },
    });

    // 关闭聊天加载状态
    internal_toggleChatLoading(false, assistantId, n("generateMessage(end)"))

  },

  /**
   * 内部方法：重新发送消息
   * 
   * 用于重新生成消息时，构建上下文并重新发送请求
   * 
   * @param {String} messageId - 消息ID
   * @param {Object} options - 选项对象
   * @param {Array} options.messages - 外部提供的消息列表
   * @param {String} options.threadId - 线程ID
   * @param {Boolean} options.inPortalThread - 是否在门户线程中
   * @returns {Promise<void>}
   */
  internal_resendMessage: async (
      messageId,
      { messages: outChats, threadId: outThreadId, inPortalThread } = {}
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
   * 这是一个空实现，用于保持代码兼容性，实际功能已被移除
   * 
   * @param {String} id - 消息ID
   * @param {Boolean} streaming - 是否正在流式传输
   */
  internal_toggleToolCallingStreaming: () => {
    // 空实现，功能已被移除
  }
})
