import { initialPreferenceState } from './initialState';
import { merge } from '@/utils/merge';
/**
 * 创建用户偏好设置相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 用户偏好设置相关状态和动作
 */
export const createPreferenceSlice = (set, get) => ({
    ...initialPreferenceState,

    /**
     * 更新用户偏好设置
     * @param {Object} updates - 更新内容
     */
    updatePreference: (updates) => set((state) => ({
        preference: { ...state.preference, ...updates },
    })),

    /**
     * 切换主题
     * @param {string} theme - 主题名称
     */
    toggleTheme: (theme) => set((state) => ({
        preference: { ...state.preference, theme },
    })),

    /**
     * 切换语言
     * @param {string} language - 语言代码
     */
    toggleLanguage: (language) => set((state) => ({
        preference: { ...state.preference, language },
    })),

    /**
     * 切换是否使用 Cmd+Enter 发送消息
     * @param {boolean} [value] - 是否使用，不传则切换
     */
    toggleUseCmdEnterToSend: (value) => set((state) => ({
        preference: {
            ...state.preference,
            useCmdEnterToSend: value !== undefined ? value : !state.preference.useCmdEnterToSend,
        },
    })),
    updateGuideState: async (guide) => {
        const { updatePreference } = get();
        const nextGuide = merge(get().preference.guide, guide);
        await updatePreference({ guide: nextGuide });
    },
    /**
     * 重置偏好设置
     */
    resetPreference: () => set({ preference: initialPreferenceState.preference }),
});