/**
 * 代理聊天相关选择器
 */
export const chatSelectors = {
    // 获取活跃主题ID
    activeTopicId: (s) => s.activeTopicId,
    
    // 判断是否有活跃主题
    hasActiveTopic: (s) => !!s.activeTopicId,
    
    // 获取代理设置实例
    agentSettingInstance: (s) => s.agentSettingInstance,
    
    // 获取当前代理聊天配置
    currentAgentChatConfig: (s) => {
        // 默认配置
        const defaultConfig = {
            displayMode: 'chat',
            enableHistoryCount: false,
            historyCount: 8,
            enableCompressThreshold: false,
            compressThreshold: 20,
            enableMaxTokens: true,
            maxTokens: 4000,
            enableSystemRole: true,
        };
        
        // 如果有代理设置实例，则合并配置
        if (s.agentSettingInstance?.chatConfig) {
            return {
                ...defaultConfig,
                ...s.agentSettingInstance.chatConfig
            };
        }
        
        return defaultConfig;
    },
}; 