import useSWR from 'swr';
import { INBOX_SESSION_ID } from '@/const/session';
import { apiClient, fetcher } from '../apiClient';

// 将类改为对象，使其可以直接被导入使用
export const messageService = {
    createMessage: async ({ sessionId, ...params }) => {
        const response = await apiClient.post('/message/create', {
            ...params,
            sessionId: messageService.toDbSessionId(sessionId),
        });
        return response.data;
    },

    batchCreateMessages: async (messages) => {
        const response = await apiClient.post('/message/batchCreate', messages);
        return response.data;
    },

    getMessages: async (sessionId, topicId) => {
        const response = await apiClient.get('/message/getMessages', {
            params: {
                sessionId: messageService.toDbSessionId(sessionId),
                topicId,
            },
        });
        return response.data;
    },

    getAllMessages: async () => {
        const response = await apiClient.get('/message/getAllMessages');
        return response.data;
    },

    getAllMessagesInSession: async (sessionId) => {
        const response = await apiClient.get('/message/getAllMessagesInSession', {
            params: {
                sessionId: messageService.toDbSessionId(sessionId),
            },
        });
        return response.data;
    },

    countMessages: async (params) => {
        const response = await apiClient.get('/message/count', { params });
        return response.data;
    },

    countWords: async (params) => {
        const response = await apiClient.get('/message/countWords', { params });
        return response.data;
    },

    rankModels: async () => {
        const response = await apiClient.get('/message/rankModels');
        return response.data;
    },

    getHeatmaps: async () => {
        const response = await apiClient.get('/message/getHeatmaps');
        return response.data;
    },

    updateMessageError: async (id, error) => {
        const response = await apiClient.post('/message/update', { id, value: { error } });
        return response.data;
    },

    updateMessagePluginError: async (id, error) => {
        const response = await apiClient.post('/message/update', { id, value: { pluginError: error } });
        return response.data;
    },

    updateMessagePluginArguments: async (id, value) => {
        const args = typeof value === 'string' ? value : JSON.stringify(value);
        const response = await apiClient.post('/message/updateMessagePlugin', {
            id,
            value: { arguments: args }
        });
        return response.data;
    },

    updateMessage: async (id, message) => {
        const response = await apiClient.post('/message/update', { id, value: message });
        return response.data;
    },

    updateMessageTranslate: async (id, translate) => {
        const response = await apiClient.post('/message/updateTranslate', {
            id,
            value: translate
        });
        return response.data;
    },

    updateMessageTTS: async (id, tts) => {
        const response = await apiClient.post('/message/updateTTS', { id, value: tts });
        return response.data;
    },

    updateMessagePluginState: async (id, value) => {
        const response = await apiClient.post('/message/updatePluginState', { id, value });
        return response.data;
    },

    removeMessage: async (id) => {
        const response = await apiClient.post('/message/removeMessage', { id });
        return response.data;
    },

    removeMessages: async (ids) => {
        const response = await apiClient.post('/message/removeMessages', { ids });
        return response.data;
    },

    removeMessagesByAssistant: async (sessionId, topicId) => {
        const response = await apiClient.post('/message/removeMessagesByAssistant', {
            sessionId: messageService.toDbSessionId(sessionId),
            topicId,
        });
        return response.data;
    },

    removeAllMessages: async () => {
        const response = await apiClient.post('/message/removeAllMessages');
        return response.data;
    },

    toDbSessionId: (sessionId) => {
        return sessionId === INBOX_SESSION_ID ? null : sessionId;
    },

    hasMessages: async () => {
        const number = await messageService.countMessages();
        return number > 0;
    },

    messageCountToCheckTrace: async () => {
        const number = await messageService.countMessages();
        return number >= 4;
    }
};

// SWR Hooks
export const useMessages = (sessionId, topicId) => {
    const key = sessionId ? `/message/getMessages?sessionId=${sessionId}${topicId ? `&topicId=${topicId}` : ''}` : null;
    return useSWR(key, fetcher);
};

export const useAllMessages = () => {
    return useSWR('/message/getAllMessages', fetcher);
};

export const useAllMessagesInSession = (sessionId) => {
    const key = sessionId ? `/message/getAllMessagesInSession?sessionId=${sessionId}` : null;
    return useSWR(key, fetcher);
};

export const useMessageCount = (params) => {
    let queryString = '/message/count';
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

export const useWordCount = (params) => {
    let queryString = '/message/countWords';
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

export const useModelRanking = () => {
    return useSWR('/message/rankModels', fetcher);
};

export const useHeatmaps = () => {
    return useSWR('/message/getHeatmaps', fetcher);
};

export const useHasMessages = () => {
    const { data } = useMessageCount();
    return { data: data !== undefined ? data > 0 : undefined };
};

export const useMessageCountToCheckTrace = () => {
    const { data } = useMessageCount();
    return { data: data !== undefined ? data >= 4 : undefined };
};