/**
 * 代理聊天相关初始状态
 */
export const initialChatState = {
    // 活跃主题ID
    activeTopicId: null,
    
    // 代理实例
    agentSettingInstance: {
        // 代理基本信息
        id: 'default',
        name: '医疗助手',
        avatar: '/images/ai-avatar.png',
        description: '我是一个医疗助手，可以回答您的医疗相关问题。',
        
        // 代理聊天配置
        chatConfig: {
            displayMode: 'chat',
            enableHistoryCount: false,
            historyCount: 8,
            enableCompressThreshold: false,
            compressThreshold: 20,
            enableMaxTokens: true,
            maxTokens: 4000,
            enableSystemRole: true,
        },
        
        // 代理模型配置
        model: 'gpt-3.5-turbo',
        provider: 'openai',
        
        // 代理系统角色
        systemRole: '你是一个专业的医疗助手，可以回答用户的医疗相关问题，提供专业的医疗建议。',
        
        // 代理元数据
        meta: {
            title: '医疗助手',
            description: '专业的医疗问答助手',
            avatar: '/images/ai-avatar.png',
            backgroundColor: '#2563eb',
            tags: ['医疗', '健康', '问答'],
        },
    },
    
    // 代理映射表
    agentMap: {
        'default': {
            id: 'default',
            name: '医疗助手',
            avatar: '/images/ai-avatar.png',
            description: '我是一个医疗助手，可以回答您的医疗相关问题。',
            meta: {
                title: '医疗助手',
                description: '专业的医疗问答助手',
                avatar: '/images/ai-avatar.png',
                backgroundColor: '#2563eb',
                tags: ['医疗', '健康', '问答'],
            },
        }
    },
    
    // 活跃代理ID
    activeId: 'default',
    
    // 默认代理配置
    defaultAgentConfig: {
        chatConfig: {
            displayMode: 'chat',
            enableHistoryCount: false,
            historyCount: 8,
            enableCompressThreshold: false,
            compressThreshold: 20,
            enableMaxTokens: true,
            maxTokens: 4000,
            enableSystemRole: true,
        },
        model: 'gpt-3.5-turbo',
        provider: 'openai',
        systemRole: '你是一个专业的医疗助手，可以回答用户的医疗相关问题，提供专业的医疗建议。',
    },
}; 