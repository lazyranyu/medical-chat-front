/**
 * AI聊天历史记忆管理模块
 * 
 * 该模块负责处理聊天历史的摘要和记忆功能，通过对聊天历史进行压缩和摘要，
 * 帮助AI保持对长对话的上下文理解能力，同时减少token消耗。
 */

import { chainSummaryHistory } from "@/chains/summaryHistory"
import { chatService} from "@/api/chatService";
import { topicService} from "@/api/topic";
import { useUserStore } from "@/store/user"
import { systemAgentSelectors } from "@/store/user/selectors"

/**
 * 聊天记忆功能模块
 * 
 * @param {Function} set - Zustand状态设置函数
 * @param {Function} get - Zustand状态获取函数
 * @returns {Object} 包含记忆相关功能的对象
 */
export const chatMemory = (set, get) => ({
  /**
   * 内部方法：生成聊天历史摘要
   * 
   * 该方法使用AI模型对聊天历史进行摘要压缩，并将摘要保存到当前话题中。
   * 注意：当前代码中的API调用部分已被注释，需要根据实际情况启用。
   * 
   * @param {Array} messages - 需要摘要的消息列表
   * @returns {Promise<void>}
   */
  internal_summaryHistory: async messages => {
    const topicId = get().activeTopicId
    // 如果消息数量少于等于1或没有活跃话题ID，则不进行摘要
    if (messages.length <= 1 || !topicId) return

    // 获取历史压缩使用的模型和提供商配置
    const { model, provider } = systemAgentSelectors.historyCompress(
        useUserStore.getState()
    )

    let historySummary = ""
    // 以下是调用聊天服务生成摘要的代码，当前已注释
    let data;
    data =  chatService.fetchPresetTaskResult(topicId)
    historySummary = data.historySummary;
    // 以下是更新话题摘要的代码，当前已注释
    await topicService.updateTopic(topicId, {
      historySummary,
      metadata: { model, provider }
    })
    
    // 刷新话题和消息数据
    await get().refreshTopic()
    await get().refreshMessages()
  }
})
