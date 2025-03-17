import useSWR from 'swr';
import { INBOX_SESSION_ID } from '@/const/session';
import { apiClient, fetcher } from '../apiClient';
// 将类转换为对象，使其可以直接被导入使用
export const threadService = {
    // 获取线程列表
    useThreads: (topicId) => {
        const { data, error, mutate } = useSWR(
            topicId ? `/threads?topicId=${topicId}` : null,
            fetcher
        );

        return {
            threads: data,
            isLoading: !error && !data,
            isError: error,
            mutate,
        };
    },

    // 创建带消息的线程
    createThreadWithMessage: async ({ message, ...params }) => {
        const sessionId = message.sessionId === INBOX_SESSION_ID ? null : message.sessionId;
        const response = await apiClient.post('/threads/create-with-message', {
            ...params,
            message: { ...message, sessionId },
        });
        return response.data;
    },

    // 更新线程
    updateThread: async (id, data) => {
        const response = await apiClient.put(`/threads/${id}`, data);
        return response.data;
    },

    // 删除线程
    removeThread: async (id) => {
        const response = await apiClient.delete(`/threads/${id}`);
        return response.data;
    },

    // 直接调用获取线程列表的 apiClient（不使用 SWR）
    getThreads: async (topicId) => {
        const response = await apiClient.get(`/threads?topicId=${topicId}`);
        return response.data;
    },
};
