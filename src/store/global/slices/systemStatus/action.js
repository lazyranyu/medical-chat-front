import { initialSystemStatusState } from './initialState';

/**
 * 创建系统状态相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 系统状态相关状态和动作
 */
export const createSystemStatusSlice = (set, get) => ({
    ...initialSystemStatusState,

    /**
     * 更新系统状态
     * @param {Object} updates - 要更新的系统状态
     */
    updateSystemStatus: (updates) => set((state) => ({
        systemStatus: { ...state.systemStatus, ...updates },
    })),

    /**
     * 切换聊天侧边栏
     * @param {boolean} [value] - 是否显示，不传则切换
     */
    toggleChatSideBar: (value) => set((state) => ({
        systemStatus: {
            ...state.systemStatus,
            showChatSideBar: value !== undefined ? value : !state.systemStatus.showChatSideBar,
        },
    })),

    /**
     * 切换聊天门户
     * @param {boolean} [value] - 是否显示，不传则切换
     */
    toggleChatPortal: (value) => set((state) => ({
        systemStatus: {
            ...state.systemStatus,
            showPortal: value !== undefined ? value : !state.systemStatus.showPortal,
        },
    })),

    /**
     * 切换会话面板
     * @param {boolean} [value] - 是否显示，不传则切换
     */
    toggleSessionPanel: (value) => set((state) => ({
        systemStatus: {
            ...state.systemStatus,
            showSessionPanel: value !== undefined ? value : !state.systemStatus.showSessionPanel,
        },
    })),

    /**
     * 切换聊天头部
     * @param {boolean} [value] - 是否显示，不传则切换
     */
    toggleChatHeader: (value) => set((state) => ({
        systemStatus: {
            ...state.systemStatus,
            showChatHeader: value !== undefined ? value : !state.systemStatus.showChatHeader,
        },
    })),

    /**
     * 切换回聊天界面
     */
    switchBackToChat: () => set((state) => ({
        systemStatus: {
            ...state.systemStatus,
            showPortal: false,
        },
    })),
});