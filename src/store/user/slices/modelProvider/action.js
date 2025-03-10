import { initialModelProviderState } from './initialState';

/**
 * 创建模型相关状态切片
 * 简化为单一模型提供商
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 模型相关状态和动作
 */
export const createModelProviderSlice = (set, get) => ({
    ...initialModelProviderState,

    /**
     * 设置当前模型ID
     * @param {string} id - 模型ID
     */
    setCurrentModelId: (id) => set({ currentModelId: id }),

    /**
     * 添加模型
     * @param {Object} model - 模型对象
     */
    addModel: (model) => set((state) => ({
        models: [...state.models, model],
    })),

    /**
     * 更新模型
     * @param {string} id - 模型ID
     * @param {Object} updates - 更新内容
     */
    updateModel: (id, updates) => set((state) => ({
        models: state.models.map((model) => 
            model.id === id ? { ...model, ...updates } : model
        ),
    })),

    /**
     * 删除模型
     * @param {string} id - 模型ID
     */
    removeModel: (id) => set((state) => ({
        models: state.models.filter((model) => model.id !== id),
    })),
});