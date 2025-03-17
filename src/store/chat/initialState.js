/**
 * 聊天模块状态管理 - 初始状态
 * 
 * 本文件定义了聊天模块的初始状态，集成了各个功能切片的初始状态
 * 为整个聊天模块提供了统一的状态起点
 */

// sort-imports-ignore
// 引入各个功能切片的初始状态
import { initialMessageState } from './slices/message/initialState'; // 消息相关的初始状态
import { initialGenerationState } from './slices/generation/initialState'; // 生成内容相关的初始状态
import { initialThreadState } from './slices/thread/initialState'; // 对话线程相关的初始状态
import { initialPortalState } from './slices/portal/initialState'; // 聊天门户相关的初始状态
import { initialTopicState } from './slices/topic/initialState'; // 话题相关的初始状态

/**
 * 聊天模块的完整初始状态
 * 合并了所有功能切片的初始状态
 */
export const initialState = {
  ...initialMessageState, // 消息状态：包含消息列表、当前消息等
  ...initialGenerationState, // 生成状态：包含AI生成内容的状态、进度等
  ...initialThreadState, // 线程状态：包含对话线程列表、当前线程等
  ...initialPortalState, // 门户状态：包含聊天界面相关的UI状态
  ...initialTopicState, // 话题状态：包含对话话题的分类、标签等
  
  // 可以根据需要添加其他状态
};