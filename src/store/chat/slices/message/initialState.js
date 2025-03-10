/**
 * 消息相关初始状态
 */
export const initialMessageState = {
    // 聊天消息列表
    messages: [],

    // 输入框消息
    inputMessage: '',

    // 是否有上传的文件
    hasUploadedFiles: false,
    
    // 消息是否已初始化
    messagesInit: true,
    
    // 活动会话ID
    activeId: 'inbox',
    
    // 活动主题ID
    activeTopicId: undefined,
    
    // 消息映射表，用于存储不同会话和主题的消息
    messagesMap: {},
    
    // 正在编辑的消息ID列表
    messageEditingIds: [],
    
    // 正在加载的消息ID列表
    messageLoadingIds: [],
    
    // 正在生成的消息ID列表
    chatLoadingIds: [],
    
    // 正在RAG流程中的消息ID列表
    messageRAGLoadingIds: [],
    
    // AI是否正在生成回复
    isAIGenerating: false,
};