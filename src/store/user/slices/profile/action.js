import { initialProfileState } from './initialState';

/**
 * 创建用户配置文件相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 用户配置文件相关状态和动作
 */
export const createProfileSlice = (set, get) => ({
    ...initialProfileState,

    /**
     * 更新用户配置文件
     * @param {Object} updates - 要更新的用户配置文件
     */
    updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates },
    })),

    /**
     * 设置用户头像
     * @param {string} avatar - 用户头像 URL
     */
    setUserAvatar: (avatar) => set((state) => ({
        profile: { ...state.profile, avatar },
    })),

    /**
     * 设置用户名
     * @param {string} username - 用户名
     */
    setUsername: (username) => set((state) => ({
        profile: { ...state.profile, username },
    })),

    /**
     * 设置用户ID
     * @param {string} id - 用户ID
     */
    setUserId: (id) => set((state) => ({
        profile: { ...state.profile, id },
    })),

    /**
     * 设置用户邮箱
     * @param {string} email - 用户邮箱
     */
    setUserEmail: (email) => set((state) => ({
        profile: { ...state.profile, email },
    })),

    /**
     * 重置用户资料
     */
    resetProfile: () => set({ profile: initialProfileState.profile }),
});