import axios from 'axios';
import {apiClient} from "@/api/apiClient";

// 创建 axios 实例
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
/**
 * 使用 fetch API 实现 SSE (适用于需要发送复杂请求体的情况)
 */
const handleFetchSSE = async (url, data, { onMessage, onError, onComplete, signal }) => {
    try {
        // 立即发送一个初始消息，使前端立即显示输入指示器
        onMessage?.({ type: 'text', text: '' });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify(data),
            signal
        });

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = ''; // 用于累积全部内容
        let receivedFirstChunk = false;

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                // 处理buffer中可能剩余的内容
                if (buffer.length > 0 && buffer.startsWith('"data:"')) {
                    try {
                        const content = buffer.substring(8, buffer.length - 1);
                        fullContent += content;
                        onMessage?.({ type: 'text', text: content });
                    } catch (e) {
                        console.error('解析最终内容错误:', e, buffer);
                    }
                }
                
                // 传递完整的内容给onComplete回调
                onComplete?.(fullContent);
                break;
            }

            // 标记已收到第一个数据块，并立即发送第一个响应以减少用户感知的延迟
            if (!receivedFirstChunk) {
                receivedFirstChunk = true;
                // 发送一个空的首次响应，触发UI更新
                onMessage?.({ type: 'text', text: ' ' });
            }

            // 使用逐字模式处理内容
            const newContent = decoder.decode(value, { stream: true });
            buffer += newContent;

            // 处理当前格式的数据块
            const parts = buffer.split('"\\n\\n"');
            buffer = parts.pop() || '';  // 保留未完成部分

            for (const part of parts) {
                if (part.startsWith('"data:"')) {
                    // 提取data:"和"之间的内容
                    const content = part.substring(8, part.length - 1); // 去掉data:"前缀和结尾的"
                    try {
                        // 累积内容
                        fullContent += content;
                        
                        // 如果内容有多个字符，分割为单个字符进行发送以增强逐字效果
                        if (content.length > 1) {
                            const chars = content.split('');
                            for (const char of chars) {
                                // 发送单个字符
                                onMessage?.({ type: 'text', text: char });
                                
                                // 可选：添加小延迟让逐字效果更明显
                                // 注意：这会使整体响应变慢，请根据需求调整或删除
                                // await new Promise(resolve => setTimeout(resolve, 5));
                            }
                        } else {
                            // 内容只有一个字符时直接发送
                            onMessage?.({ type: 'text', text: content });
                        }
                    } catch (e) {
                        console.error('解析错误:', e, content);
                    }
                }
            }
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('请求被中止');
        } else {
            onError?.(error);
        }
    }
};
/**
 * 聊天服务
 */
export const chatService = {
    /**
     * 创建助手消息流
     */
    createAssistantMessageStream: async ({
                                             params,
                                             abortController,
                                             onMessageHandle,
                                             onFinish,
                                             onErrorHandle,
                                             onAbort,
                                             isWelcomeQuestion,
                                             historySummary,
                                         }) => {
        try {
            // 准备请求数据
            const requestData = {
                messages: params.messages,
                plugins: params.plugins,
                model: params.model,
                temperature: params.temperature,
                top_p: params.top_p,
                max_tokens: params.max_tokens,
                presence_penalty: params.presence_penalty,
                frequency_penalty: params.frequency_penalty,
                context: {
                    isWelcomeQuestion,
                    historySummary,
                }
            };

            // 使用 fetch API 实现 SSE
            await handleFetchSSE('/api/hello', requestData, {
                onMessage: onMessageHandle,
                onError: onErrorHandle,
                onComplete: onFinish,
                signal: abortController?.signal,
            });
        } catch (error) {
            if (error.name === 'AbortError') {
                onAbort?.();
            } else {
                onErrorHandle?.(error);
            }
        }
    },

    /**
     * 创建助手消息（非流式）
     */
    createAssistantMessage: async (params) => {
        const response = await api.post('/api/chat/completion', {
            messages: params.messages,
            plugins: params.plugins,
            model: params.model,
            temperature: params.temperature,
            top_p: params.top_p,
            max_tokens: params.max_tokens,
            presence_penalty: params.presence_penalty,
            frequency_penalty: params.frequency_penalty,
        });

        return response.data;
    },

    /**
     * 取消正在进行的请求
     */
    cancelRequest: (abortController) => {
        if (abortController) {
            abortController.abort();
        }
    },

    fetchPresetTaskResult: async (topicId) => {
        const response = await apiClient.post('/message/batchCreate', {topicId});
        return response.data;
    },
    hello: async (name) => {
        const response = await apiClient.get('/message/hello', {
            params: {
                name: name || 'unknown user' // 与后端defaultValue匹配
            },
            paramsSerializer: params => {
                return new URLSearchParams(params).toString()
            }
        });
        return response.data;
    }
};
