/**
 * 消息相关选择器
 */
export const messageSelectors = {
    // 获取所有消息
    messages: (s) => s.messages,

    // 获取输入框消息
    inputMessage: (s) => s.inputMessage,

    // 判断发送按钮是否因为消息为空而禁用
    isSendButtonDisabledByMessage: (s) => !s.inputMessage.trim() && !s.hasUploadedFiles,

    // 获取最后一条消息
    lastMessage: (s) => {
        const { messages } = s;
        return messages.length > 0 ? messages[messages.length - 1] : null;
    },
    
    // 消息映射键生成函数
    messageMapKey: (sessionId, topicId) => `${sessionId}_${topicId}`,
    
    // 获取当前聊天的ID
    currentChatKey: (s) => messageSelectors.messageMapKey(s.activeId, s.activeTopicId),
    
    // 判断当前聊天是否已加载
    isCurrentChatLoaded: (s) => {
        // 如果messagesInit为true，则认为已加载
        if (s.messagesInit === true) return true;
        
        // 否则检查messagesMap中是否存在对应的键
        const key = messageSelectors.currentChatKey(s);
        return !!s.messagesMap[key];
    },
    
    // 判断当前聊天是否正在加载
    currentChatLoadingState: (s) => !s.messagesInit,
    
    // 获取主要显示的聊天ID列表
    mainDisplayChatIDs: (s) => {
        return s.messages.map(msg => msg.id);
    },
    
    // 获取消息通过ID
    getMessageById: (id) => (s) => {
        return s.messages.find(msg => msg.id === id);
    },

    
    // 判断是否显示收件箱欢迎页面
    showInboxWelcome: (s) => {
        const INBOX_SESSION_ID = 'inbox'; // 请确保这个值与你的应用中定义的一致
        const isInbox = s.activeId === INBOX_SESSION_ID;
        if (!isInbox) return false;

        // 这里我们使用messages.length作为判断依据
        // 如果你有activeBaseChats函数，请替换为该函数
        return s.messages.length === 0;
    },

    // 判断消息是否正在编辑
    isMessageEditing: (id) => (s) => {
        return s.messageEditingIds?.includes(id) || false;
    },

    // 判断消息是否正在加载
    isMessageLoading: (id) => (s) => {
        return s.messageLoadingIds?.includes(id) || false;
    },

    // 判断消息是否正在生成
    isMessageGenerating: (id) => (s) => {
        return s.chatLoadingIds?.includes(id) || false;
    },

    // 判断消息是否在RAG流程中
    isMessageInRAGFlow: (id) => (s) => {
        return s.messageRAGLoadingIds?.includes(id) || false;
    },

    // 判断AI是否正在生成回复
    isAIGenerating: (s) => {
        return s.isAIGenerating || false;
    }
};