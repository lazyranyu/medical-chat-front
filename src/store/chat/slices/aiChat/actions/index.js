/**
 * AI聊天功能模块的入口文件
 * 
 * 该文件导入并组合了AI聊天相关的所有功能模块，包括：
 * - generateAIChat: 处理AI消息生成的核心功能
 * - chatMemory: 处理聊天历史记忆和摘要功能
 * - chatRag: 处理检索增强生成(RAG)相关功能
 * 
 * 通过chatAiChat函数将这些功能模块组合成一个统一的对象，
 * 使用展开运算符(...)将各个模块的方法和属性合并。
 */

import { generateAIChat } from "./generateAIChat"
import { chatMemory } from "./memory"
// import { chatRag } from "./rag"

/**
 * 组合所有AI聊天相关功能的函数
 * @param {...any} params - 传递给各个功能模块的参数(通常是set和get函数)
 * @returns {Object} - 包含所有AI聊天功能的合并对象
 */
export const chatAiChat = (...params) => ({
  // ...chatRag(...params),
  ...generateAIChat(...params),
  ...chatMemory(...params)
})
