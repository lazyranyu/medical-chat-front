import { useUserStore } from '@/store/user';
import { modelProviderSelectors } from '@/store/user/selectors';

/**
 * 代理相关选择器
 */
export const agentSelectors = {
    // 获取所有代理
    agents: (s) => s?.agents || [],
    
    // 获取当前代理ID
    currentAgentId: (s) => s?.currentAgentId,
    
    // 获取当前代理
    currentAgent: (s) => {
        const agents = agentSelectors.agents(s);
        const currentAgentId = agentSelectors.currentAgentId(s);
        
        if (!agents || !currentAgentId) return null;
        
        return agents.find((agent) => agent.id === currentAgentId) || null;
    },
    
    // 获取当前代理模型
    currentAgentModel: (s) => {
        const currentAgent = agentSelectors.currentAgent(s);
        
        // 如果代理有指定模型，则使用代理模型
        if (currentAgent?.model) return currentAgent.model;
        
        // 否则使用用户当前选择的模型
        return useUserStore.getState().currentModelId || 'gpt-4';
    },
    
    // 判断是否有系统角色
    hasSystemRole: (s) => {
        const currentAgent = agentSelectors.currentAgent(s);
        return !!currentAgent?.systemPrompt;
    },
    
    // 获取代理设置
    agentSettings: (s) => s?.agentSettings || {},
    
    // 获取当前代理聊天配置
    currentAgentChatConfig: (s) => {
        // 返回默认配置，避免错误
        return {
            enableHistoryCount: false,
            historyCount: 0
        };
    },
}; 