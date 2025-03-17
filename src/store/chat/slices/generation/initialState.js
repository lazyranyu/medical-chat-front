/**
 * 聊天生成切片 - 初始状态
 * 
 * 定义了AI内容生成相关的初始状态
 * 用于跟踪AI回复的生成状态和进度
 */
export const initialGenerationState = {
    // 是否正在生成AI回复
    // 此标志用于控制UI中的加载状态和防止重复请求
    isAIGenerating: false,
};