/**
 * 聊天生成切片 - 动作
 * 
 * 定义了AI内容生成相关的状态更新动作
 * 这些动作用于控制AI回复的生成过程
 */

import { initialGenerationState } from './initialState'; // 导入初始状态

/**
 * 创建AI生成相关状态切片
 * 
 * @param {Function} set - Zustand的set函数，用于更新状态
 * @param {Function} get - Zustand的get函数，用于获取当前状态
 * @returns {Object} 包含AI生成相关状态和动作的对象
 */
export const createGenerationSlice = (set, get) => ({
    ...initialGenerationState, // 合并初始状态

    /**
     * 停止生成AI回复
     * 
     * 将isAIGenerating设置为false，表示停止生成过程
     * 在实际实现中，这个函数还应该负责取消正在进行的API请求
     */
    stopGenerateMessage: () => {
        set({ isAIGenerating: false });
    },
});