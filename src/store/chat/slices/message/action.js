import { initialMessageState } from './initialState';

/**
 * 创建消息相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 消息相关状态和动作
 */
export const createMessageSlice = (set, get) => ({
    ...initialMessageState,

    /**
     * 更新输入消息
     * @param {string} message - 新的输入消息
     */
    updateInputMessage: (message) => {
        console.log('更新输入消息:', message);
        set({ inputMessage: message });
    },

    /**
     * 添加用户消息
     * @param {string} content - 消息内容
     * @returns {Object} 添加的消息对象
     */
    addUserMessage: (content) => {
        const message = {
            id: Date.now(),
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };

        console.log('添加用户消息:', message);
        
        set((state) => {
            const newMessages = [...state.messages, message];
            console.log('更新后的消息列表:', newMessages);
            return {
                messages: newMessages,
            };
        });

        return message;
    },

    /**
     * 添加 AI 消息
     * @param {string} content - 消息内容
     * @returns {Object} 添加的消息对象
     */
    addAIMessage: (content) => {
        const message = {
            id: Date.now(),
            role: 'assistant',
            content,
            createdAt: new Date().toISOString(),
        };

        console.log('添加AI消息:', message);
        
        set((state) => {
            const newMessages = [...state.messages, message];
            console.log('更新后的消息列表:', newMessages);
            return {
                messages: newMessages,
            };
        });

        return message;
    },

    /**
     * 清空所有消息
     */
    clearMessage: () => {
        console.log('清空所有消息');
        set({ messages: [] });
    },

    /**
     * 修改消息内容
     * @param {string} id - 消息ID
     * @param {string} content - 新的消息内容
     * @returns {Promise<void>}
     */
    modifyMessageContent: async (id, content) => {
        console.log(`修改消息 ${id} 的内容为:`, content);
        
        set((state) => {
            const newMessages = state.messages.map(msg => 
                msg.id === id ? { ...msg, content } : msg
            );
            
            console.log('更新后的消息列表:', newMessages);
            return {
                messages: newMessages,
            };
        });
    },

    /**
     * 切换消息编辑状态
     * @param {string} id - 消息ID
     * @param {boolean} editing - 是否处于编辑状态
     */
    toggleMessageEditing: (id, editing) => {
        console.log(`切换消息 ${id} 的编辑状态为:`, editing);
        
        set((state) => {
            // 如果messageEditingIds不存在，初始化为空数组
            const messageEditingIds = state.messageEditingIds || [];
            
            // 如果editing为true且不在数组中，添加到数组
            // 如果editing为false且在数组中，从数组中移除
            const newMessageEditingIds = editing 
                ? (messageEditingIds.includes(id) ? messageEditingIds : [...messageEditingIds, id])
                : messageEditingIds.filter(item => item !== id);
            
            return {
                messageEditingIds: newMessageEditingIds,
            };
        });
    },

    /**
     * 获取消息列表
     * @param {string} sessionId - 会话ID
     * @param {string} topicId - 主题ID
     * @returns {Promise<void>}
     */
    fetchMessages: async (sessionId, topicId) => {
        try {
            console.log('开始获取消息，设置 messagesInit = false');
            // 设置消息初始化状态
            set({ messagesInit: false });
            
            // 这里应该是实际的API调用，获取消息列表
            // 目前使用模拟数据
            // 在实际项目中，这里应该调用后端API获取消息
            console.log(`获取会话 ${sessionId} 主题 ${topicId} 的消息列表`);
            
            // 如果需要与Java后端交互，可以在这里添加相关代码
            // 例如：const messages = await fetch(`/api/messages?sessionId=${sessionId}&topicId=${topicId}`);
            
            // 模拟延迟，然后设置消息初始化完成
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 获取当前消息列表
            const currentMessages = get().messages;
            
            // 如果当前没有消息，添加一条测试消息
            if (currentMessages.length === 0) {
                const testMessage = {
                    id: Date.now(),
                    role: 'assistant',
                    content: '欢迎使用医疗聊天系统，请问有什么可以帮助您的？',
                    createdAt: new Date().toISOString(),
                };
                
                // 获取消息映射键
                const { messageSelectors } = get();
                const key = `${sessionId}_${topicId}`;
                
                // 更新消息列表和消息映射
                set((state) => {
                    const newMessages = [...state.messages, testMessage];
                    return {
                        messages: newMessages,
                        messagesInit: true,
                        messagesMap: {
                            ...state.messagesMap,
                            [key]: newMessages
                        }
                    };
                });
                console.log('添加了欢迎消息:', testMessage);
            } else {
                // 如果已有消息，也需要更新messagesMap
                const key = `${sessionId}_${topicId}`;
                set((state) => ({
                    messagesInit: true,
                    messagesMap: {
                        ...state.messagesMap,
                        [key]: state.messages
                    }
                }));
            }
            
            console.log('消息获取完成，设置 messagesInit = true');
        } catch (error) {
            console.error('获取消息列表失败:', error);
            // 即使出错也要设置初始化完成，避免一直显示加载状态
            set({ messagesInit: true });
            console.log('出错但仍设置 messagesInit = true');
        }
    },

    /**
     * 发送消息
     * @param {Object} params - 发送参数
     * @param {string} params.message - 消息内容，默认为当前输入框内容
     * @param {Array} params.files - 附带文件，默认为空
     * @param {boolean} params.onlyAddUserMessage - 是否只添加用户消息不生成 AI 回复
     * @param {boolean} params.isWelcomeQuestion - 是否是欢迎页面的问题
     */
    sendMessage: async (params = {}) => {
        const state = get();
        const {
            message = state.inputMessage,
            files = [],
            onlyAddUserMessage = false,
            isWelcomeQuestion = false
        } = params;

        console.log('sendMessage 被调用，参数:', {
            message,
            files,
            onlyAddUserMessage,
            isWelcomeQuestion,
            currentState: {
                inputMessage: state.inputMessage,
                isAIGenerating: state.isAIGenerating,
                messagesCount: state.messages.length
            }
        });

        // 获取当前的 isAIGenerating 状态
        const currentIsAIGenerating = state.isAIGenerating;

        // 确保 isAIGenerating 初始状态为 false
        if (currentIsAIGenerating && !isWelcomeQuestion) {
            console.log('AI 正在生成回复，不发送新消息');
            return;
        }

        // 如果没有消息且没有文件，则不发送
        if (!message.trim() && files.length === 0) {
            console.log('没有消息且没有文件，不发送');
            return;
        }

        try {
            // 创建用户消息对象
            const userMessage = {
                id: Date.now(),
                role: 'user',
                content: message,
                createdAt: new Date().toISOString(),
            };
            
            console.log('准备添加用户消息:', userMessage);
            
            // 直接更新state，确保消息被添加
            set((state) => {
                const newMessages = [...state.messages, userMessage];
                console.log('更新后的消息列表:', newMessages);
                return {
                    messages: newMessages,
                    inputMessage: '', // 清空输入框
                    messagesInit: true, // 确保messagesInit为true
                };
            });
            
            console.log('用户消息已添加，当前消息列表:', get().messages);

            // 如果只添加用户消息，则不生成 AI 回复
            if (onlyAddUserMessage) {
                console.log('只添加用户消息，不生成 AI 回复');
                return;
            }

            // 开始生成 AI 回复
            console.log('开始生成 AI 回复，设置 isAIGenerating = true');
            set({ isAIGenerating: true });

            // 这里应该是实际的 API 调用
            // 模拟 API 调用延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 创建AI回复消息对象
            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: '这是 AI 的回复',
                createdAt: new Date().toISOString(),
            };
            
            console.log('准备添加AI回复:', aiMessage);
            
            // 直接更新state，确保AI回复被添加
            set((state) => {
                const newMessages = [...state.messages, aiMessage];
                console.log('添加AI回复后的消息列表:', newMessages);
                return {
                    messages: newMessages,
                    isAIGenerating: false, // 设置生成状态为false
                    messagesInit: true, // 确保messagesInit为true
                };
            });
            
            console.log('AI回复已添加，当前消息列表:', get().messages);
            
            // 确保状态更新后，再次检查消息列表
            setTimeout(() => {
                const currentState = get();
                console.log('发送完成后的状态:', {
                    messages: currentState.messages,
                    isAIGenerating: currentState.isAIGenerating,
                    messagesInit: currentState.messagesInit
                });
            }, 100);
        } catch (error) {
            console.error('发送消息失败:', error);
            // 确保即使出错也重置生成状态
            set({ 
                isAIGenerating: false,
                messagesInit: true // 确保messagesInit为true
            });
        }
    },
});