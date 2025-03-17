import axios from 'axios';
import useSWR from 'swr';
import { INBOX_SESSION_ID } from '@/const/session';
import { apiClient, fetcher } from '../apiClient';

// 辅助函数
const toDbSessionId = (sessionId) => {
    return sessionId === INBOX_SESSION_ID ? null : sessionId;
};

// 直接导出服务对象
export const topicService = {
    createTopic: async (params) => {
        const response = await apiClient.post('/topic/create', {
            ...params,
            sessionId: toDbSessionId(params.sessionId),
        });
        return response.data;
    },

    batchCreateTopics: async (importTopics) => {
        const response = await apiClient.post('/topic/batchCreate', importTopics);
        return response.data;
    },

    cloneTopic: async (id, newTitle) => {
        const response = await apiClient.post('/topic/clone', { id, newTitle });
        return response.data;
    },

    getTopics: async (params) => {
        const response = await apiClient.get('/topic/getTopics', {
            params: {
                ...params,
                sessionId: toDbSessionId(params.sessionId),
            },
        });
        return response.data;
    },

    getAllTopics: async () => {
        const response = await apiClient.get('/topic/getAllTopics');
        return response.data;
    },

    countTopics: async (params) => {
        const response = await apiClient.get('/topic/count', { params });
        return response.data;
    },

    rankTopics: async (limit) => {
        const response = await apiClient.get('/topic/rank', {
            params: { limit }
        });
        return response.data;
    },

    searchTopics: async (keywords, sessionId) => {
        const response = await apiClient.get('/topic/search', {
            params: {
                keywords,
                sessionId: toDbSessionId(sessionId),
            },
        });
        return response.data;
    },

    updateTopic: async (id, data) => {
        const response = await apiClient.post('/topic/update', { id, value: data });
        return response.data;
    },

    removeTopic: async (id) => {
        const response = await apiClient.post('/topic/remove', { id });
        return response.data;
    },

    removeTopics: async (sessionId) => {
        const response = await apiClient.post('/topic/removeBySession', {
            id: toDbSessionId(sessionId)
        });
        return response.data;
    },

    batchRemoveTopics: async (topics) => {
        const response = await apiClient.post('/topic/batchRemove', { ids: topics });
        return response.data;
    },

    removeAllTopic: async () => {
        const response = await apiClient.post('/topic/removeAll');
        return response.data;
    }
};

// SWR Hooks
export const useTopics = (params) => {
    const sessionId = params?.sessionId;
    const key = sessionId ? `/topic/getTopics?sessionId=${sessionId}${params.current ? `&current=${params.current}` : ''}${params.pageSize ? `&pageSize=${params.pageSize}` : ''}` : null;
    return useSWR(key, fetcher);
};

export const useAllTopics = () => {
    return useSWR('/topic/getAllTopics', fetcher);
};

export const useTopicCount = (params) => {
    let queryString = '/topic/count';
    if (params) {
        const queryParams = new URLSearchParams();
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.range) {
            queryParams.append('range[0]', params.range[0]);
            queryParams.append('range[1]', params.range[1]);
        }
        if (queryParams.toString()) {
            queryString += `?${queryParams.toString()}`;
        }
    }
    return useSWR(queryString, fetcher);
};

export const useTopicRanking = (limit) => {
    const queryString = limit ? `/topic/rank?limit=${limit}` : '/topic/rank';
    return useSWR(queryString, fetcher);
};

export const useSearchTopics = (keywords, sessionId) => {
    const key = keywords ? `/topic/search?keywords=${encodeURIComponent(keywords)}${sessionId ? `&sessionId=${sessionId}` : ''}` : null;
    return useSWR(key, fetcher);
};