/**
 * 聊天生成切片 - 选择器
 * 
 * 定义了用于从状态中提取AI生成相关数据的选择器函数
 * 这些选择器用于在组件中访问生成状态
 */

/**
 * 导出所有AI生成相关的选择器
 * 
 * @property {Function} isAIGenerating - 获取AI是否正在生成回复的状态
 *                                      用于控制UI中的加载指示器和禁用某些交互
 */
export const generationSelectors = {
    // 是否正在生成AI回复
    // 返回布尔值，表示当前是否有正在进行的AI生成过程
    isAIGenerating: (s) => s.isAIGenerating,
};