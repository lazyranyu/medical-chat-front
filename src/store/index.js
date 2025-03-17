/**
 * 状态管理中心 - 主入口文件
 * 
 * 本文件集中导出所有状态管理模块，方便在组件中统一导入使用
 * 项目使用 Zustand 作为状态管理库，每个功能模块都有自己的 store
 */

// 聊天状态管理模块
// useChatStore: 用于管理聊天相关的状态，如消息、对话线程等
export { useChatStore } from './chat';
// 导出所有聊天相关的选择器函数，用于获取特定的聊天状态
export * from './chat/selectors';

// 文件状态管理模块
// useFileStore: 用于管理文件上传、下载、列表等状态
// fileStableSelectors: 提供稳定的文件选择器，避免不必要的重渲染
export { useFileStore, fileStableSelectors } from './file';
// 导出所有文件相关的选择器函数
export * from './file/selectors';

// 全局 UI 状态管理模块
// useGlobalStore: 管理应用全局状态，如主题、布局、模态框等
export { useGlobalStore } from './global';
// 导出所有全局状态的选择器函数
export * from './global/selectors';

// 用户状态管理模块
// useUserStore: 管理用户信息、认证状态、权限等
export { useUserStore } from './user';
// 导出所有用户相关的选择器函数
export * from './user/selectors';

// 代理状态管理模块
// useAgentStore: 管理AI代理相关的状态，如代理配置、运行状态等
export { useAgentStore } from './agent';
// 导出所有代理相关的选择器函数
export * from './agent/selectors';

// 会话状态管理模块
// useSessionStore: 管理用户会话相关状态，如会话列表、当前会话等
export { useSessionStore } from './session';
// 导出所有会话相关的选择器函数
export * from './session/selectors';

// 服务器配置状态管理模块
// useServerConfigStore: 管理服务器配置相关状态，如API地址、超时设置等
export { useServerConfigStore } from './serverConfig';
// 导出所有服务器配置相关的选择器函数
export * from './serverConfig/selectors';

// 中间件
// createDevtools: 开发工具中间件，用于调试状态变化
export { createDevtools } from './middleware/createDevtools';