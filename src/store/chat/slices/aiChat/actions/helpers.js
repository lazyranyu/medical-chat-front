/**
 * AI聊天功能的辅助工具函数模块
 * 
 * 该模块提供了一系列用于获取Agent配置信息的辅助函数，
 * 这些函数主要用于从全局状态中获取当前活跃Agent的各种配置和知识库信息。
 */

import { useAgentStore } from "@/store/agent"
import { agentSelectors } from "@/store/agent/selectors"

/**
 * 获取当前活跃Agent的基本配置信息
 * 
 * @returns {Object} 当前Agent的配置对象
 */
export const getAgentConfig = () =>
    agentSelectors.currentAgentConfig(useAgentStore.getState())

/**
 * 获取当前活跃Agent的聊天相关配置信息
 * 
 * @returns {Object} 当前Agent的聊天配置对象，包含模型参数、提示词等
 */
export const getAgentChatConfig = () =>
    agentSelectors.currentAgentChatConfig(useAgentStore.getState())

/**
 * 获取当前活跃Agent的已启用知识库信息
 * 
 * @returns {Array} 当前Agent已启用的知识库列表
 */
export const getAgentKnowledge = () =>
    agentSelectors.currentEnabledKnowledge(useAgentStore.getState())
