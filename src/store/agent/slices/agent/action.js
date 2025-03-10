import { initialAgentState } from './initialState';

/**
 * 创建代理相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 代理相关状态和动作
 */
export const createAgentSlice = (set, get) => ({
    ...initialAgentState,

    /**
     * 设置当前代理ID
     * @param {string} id - 代理ID
     */
    setCurrentAgentId: (id) => set({ currentAgentId: id }),

    /**
     * 添加代理
     * @param {Object} agent - 代理对象
     */
    addAgent: (agent) => set((state) => ({
        agents: [...state.agents, agent],
    })),

    /**
     * 更新代理
     * @param {string} id - 代理ID
     * @param {Object} updates - 更新内容
     */
    updateAgent: (id, updates) => set((state) => ({
        agents: state.agents.map((agent) => 
            agent.id === id ? { ...agent, ...updates } : agent
        ),
    })),

    /**
     * 删除代理
     * @param {string} id - 代理ID
     */
    removeAgent: (id) => set((state) => ({
        agents: state.agents.filter((agent) => agent.id !== id),
    })),

    /**
     * 更新代理设置
     * @param {Object} settings - 设置对象
     */
    updateAgentSettings: (settings) => set((state) => ({
        agentSettings: { ...state.agentSettings, ...settings },
    })),
}); 