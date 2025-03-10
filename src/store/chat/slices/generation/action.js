import { initialGenerationState } from './initialState';

/**
 * 创建 AI 生成相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} AI 生成相关状态和动作
 */
export const createGenerationSlice = (set, get) => ({
    ...initialGenerationState,

    /**
     * 停止生成 AI 回复
     * 实际实现中应该取消 API 请求
     */
    stopGenerateMessage: () => {
        set({ isAIGenerating: false });
    },
});