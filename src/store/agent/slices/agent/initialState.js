/**
 * 代理相关初始状态
 */
export const initialAgentState = {
    // 代理列表
    agents: [],
    
    // 当前选中的代理ID
    currentAgentId: null,
    
    // 代理设置
    agentSettings: {
        temperature: 0.7,
        maxTokens: 2000,
        systemPrompt: '',
    },
}; 