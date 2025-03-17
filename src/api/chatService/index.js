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
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
            },
            body: JSON.stringify(data),
            signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        onComplete();
                        return;
                    }

                    try {
                        const parsedData = JSON.parse(data);
                        onMessage(parsedData);
                    } catch (e) {
                        console.error('解析消息失败:', e);
                    }
                }
            }
        }

        onComplete();
    } catch (error) {
        if (error.name === 'AbortError') {
            // 请求被中止
            return;
        }
        onError(error);
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
                                             trace,
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
                    trace,
                }
            };

            // 使用 fetch API 实现 SSE
            await handleFetchSSE('/api/chat/stream', requestData, {
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
        const response = await apiClient.get('/hello', {
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
