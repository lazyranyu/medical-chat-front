/**
 * 聊天模块状态管理 - 入口文件
 * 
 * 本文件导出聊天相关的状态管理工具：
 * - useChatStore: 聊天状态管理的主要hook，用于在组件中访问和修改聊天状态
 * - initialState: 聊天状态的初始值，定义了聊天模块的默认状态结构
 */

export { useChatStore } from './store';
export { initialState } from './initialState'; 