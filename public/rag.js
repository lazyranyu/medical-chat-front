/**
 * 检索增强生成(RAG)功能模块
 * 
 * 该模块实现了基于知识库的检索增强生成功能，包括：
 * - 查询重写：优化用户输入以提高检索效果
 * - 语义检索：从知识库中检索相关内容
 * - 结果整合：将检索结果与AI生成结合
 * 
 * RAG技术通过从知识库中检索相关信息来增强AI回复的准确性和相关性。
 */

import { chainRewriteQuery } from "@/chains/rewriteQuery"
// import { chatService } from "@/services/chat"
// import { ragService } from "@/services/rag"
import { useAgentStore } from "@/store/agent"
import { agentSelectors } from "@/store/agent/selectors"
import { messageSelectors } from "@/store/chat/selectors"
import { toggleBooleanList } from "@/store/chat/utils"
import { useUserStore } from "@/store/user"
import { systemAgentSelectors } from "@/store/user/selectors"

/**
 * 获取当前Agent的知识库ID列表
 * @returns {Object} 包含文件ID和知识库ID的对象
 */
const knowledgeIds = () =>
    agentSelectors.currentKnowledgeIds(useAgentStore.getState())

/**
 * 检查当前Agent是否有启用的知识库
 * @returns {Boolean} 是否有启用的知识库
 */
const hasEnabledKnowledge = () =>
    agentSelectors.hasEnabledKnowledge(useAgentStore.getState())

/**
 * RAG功能模块主体
 * 
 * @param {Function} set - Zustand状态设置函数
 * @param {Function} get - Zustand状态获取函数
 * @returns {Object} 包含RAG相关功能的对象
 */
export const chatRag = (set, get) => ({
  /**
   * 删除用户消息的RAG查询
   * 
   * @param {String} id - 消息ID
   * @returns {Promise<void>}
   */
  deleteUserMessageRagQuery: async id => {
    const message = messageSelectors.getMessageById(id)(get())

    if (!message || !message.ragQueryId) return

    // 乐观更新消息的ragQuery
    get().internal_dispatchMessage({
      id,
      type: "updateMessage",
      value: { ragQuery: null }
    })

    // 注释的API调用代码
    // await ragService.deleteMessageRagQuery(message.ragQueryId)
    await get().refreshMessages()
  },

  /**
   * 内部方法：从知识库检索相关内容块
   * 
   * @param {String} id - 消息ID
   * @param {String} userQuery - 用户原始查询
   * @param {Array} messages - 聊天历史消息
   * @returns {Promise<Object>} 包含检索结果的对象
   */
  internal_retrieveChunks: async (id, userQuery, messages) => {
    // 设置消息RAG加载状态
    get().internal_toggleMessageRAGLoading(true, id)

    const message = messageSelectors.getMessageById(id)(get())

    // 1. 获取重写查询
    let rewriteQuery = message?.ragQuery

    // 如果没有ragQuery且有聊天历史，需要重写用户消息以获得更好的结果
    if (!message?.ragQuery && messages.length > 0) {
      rewriteQuery = await get().internal_rewriteQuery(id, userQuery, messages)
    }

    // 2. 从语义搜索中检索内容块
    const files = messageSelectors.currentUserFiles(get()).map(f => f.id)
    // 注释的API调用代码
    // const { chunks, queryId } = await ragService.semanticSearchForChat({
    //   fileIds: knowledgeIds().fileIds.concat(files),
    //   knowledgeIds: knowledgeIds().knowledgeBaseIds,
    //   messageId: id,
    //   rewriteQuery: rewriteQuery || userQuery,
    //   userQuery
    // })

    // 关闭消息RAG加载状态
    get().internal_toggleMessageRAGLoading(false, id)

    return { chunks, queryId, rewriteQuery }
  },

  /**
   * 内部方法：重写用户查询以优化检索效果
   * 
   * @param {String} id - 消息ID
   * @param {String} content - 用户原始内容
   * @param {Array} messages - 聊天历史消息
   * @returns {Promise<String>} 重写后的查询
   */
  internal_rewriteQuery: async (id, content, messages) => {
    let rewriteQuery = content

    // 获取查询重写配置
    const queryRewriteConfig = systemAgentSelectors.queryRewrite(
        useUserStore.getState()
    )
    // 如果未启用查询重写，直接返回原始内容
    if (!queryRewriteConfig.enabled) return content

    // 准备查询重写参数
    const rewriteQueryParams = {
      model: queryRewriteConfig.model,
      provider: queryRewriteConfig.provider,
      ...chainRewriteQuery(
          content,
          messages,
          !!queryRewriteConfig.customPrompt
              ? queryRewriteConfig.customPrompt
              : undefined
      )
    }

    let ragQuery = ""
    // 注释的API调用代码
    // await chatService.fetchPresetTaskResult({
    //   onFinish: async text => {
    //     rewriteQuery = text
    //   },
    //
    //   onMessageHandle: chunk => {
    //     if (chunk.type !== "text") return
    //     ragQuery += chunk.text
    //
    //     get().internal_dispatchMessage({
    //       id,
    //       type: "updateMessage",
    //       value: { ragQuery }
    //     })
    //   },
    //   params: rewriteQueryParams
    // })

    return rewriteQuery
  },

  /**
   * 内部方法：判断是否应该使用RAG
   * 
   * @returns {Boolean} 是否应该使用RAG
   */
  internal_shouldUseRAG: () => {
    const userFiles = messageSelectors.currentUserFiles(get()).map(f => f.id)
    // 如果有相关文件或启用的知识库，尝试使用ragQuery
    return hasEnabledKnowledge() || userFiles.length > 0
  },

  /**
   * 内部方法：切换消息RAG加载状态
   * 
   * @param {Boolean} loading - 是否正在加载
   * @param {String} id - 消息ID
   */
  internal_toggleMessageRAGLoading: (loading, id) => {
    set(
        {
          messageRAGLoadingIds: toggleBooleanList(
              get().messageRAGLoadingIds,
              id,
              loading
          )
        },
        false,
        "internal_toggleMessageLoading"
    )
  },

  /**
   * 重写指定消息的查询
   * 
   * @param {String} id - 消息ID
   * @returns {Promise<void>}
   */
  rewriteQuery: async id => {
    const message = messageSelectors.getMessageById(id)(get())
    if (!message) return

    // 删除当前ragQuery
    await get().deleteUserMessageRagQuery(id)

    const chats = messageSelectors.mainAIChatsWithHistoryConfig(get())

    // 重新生成查询
    await get().internal_rewriteQuery(
        id,
        message.content,
        chats.map(m => m.content)
    )
  }
})
