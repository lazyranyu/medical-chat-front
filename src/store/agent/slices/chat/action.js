import { initialChatState } from './initialState';

/**
 * 创建代理聊天相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 代理聊天相关状态和动作
 */
export const createChatSlice = (set, get) => ({
    ...initialChatState,

    /**
     * 设置活跃主题ID
     * @param {string} id - 主题ID
     */
    setActiveTopicId: (id) => set({ activeTopicId: id }),

    /**
     * 打开新主题或保存当前消息
     */
    openNewTopicOrSaveTopic: async () => {
        const state = get();
        
        if (state.activeTopicId) {
            // 如果有活跃主题，创建新主题
            set({ activeTopicId: null });
        } else {
            // 如果没有活跃主题，保存当前消息为新主题
            const newTopicId = Date.now().toString();
            set({ activeTopicId: newTopicId });
        }
    },
}); 