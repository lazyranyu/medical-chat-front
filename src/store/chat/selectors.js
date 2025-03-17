/**
 * 聊天模块状态管理 - 选择器导出
 * 
 * 本文件集中导出所有聊天相关的选择器函数
 * 选择器(Selectors)用于从状态中提取特定数据，避免组件直接访问状态结构
 * 使用选择器可以优化性能并使状态访问更加一致
 */

// 导出所有聊天门户相关的选择器
export * from './slices/portal/selectors';

// 导出对话线程相关的选择器
export { threadSelectors } from './slices/thread/selectors';

// 导出话题相关的选择器
export { topicSelectors } from './slices/topic/selectors';

// 导出消息相关的选择器
export { messageSelectors } from './slices/message/selectors';