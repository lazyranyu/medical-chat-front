import useSWR from 'swr';
import { DEFAULT_AGENT_CONFIG } from '@/const/settings';
import { apiClient, fetcher } from '../apiClient';
// 将类转换为对象，使其可以直接被导入使用
export const sessionService = {
    // 检查是否有会话
    hasSessions: async () => {
        const result = await sessionService.countSessions();
        return result === 0;
    },

    // 创建会话
    createSession: async (type, data) => {
        const { config, group, meta, ...session } = data;
        const response = await apiClient.post('/sessions', {
            config: { ...config, ...meta },
            session: { ...session, groupId: group },
            type,
        });
        return response.data;
    },

    // 批量创建会话
    batchCreateSessions: async (importSessions) => {
        const response = await apiClient.post('/sessions/batch', importSessions);
        console.log(response.data);
        return response.data;
    },

    // 克隆会话
    cloneSession: async (id, newTitle) => {
        const response = await apiClient.post('/sessions/clone', { id, newTitle });
        return response.data;
    },

    // 使用 SWR 获取分组会话列表
    useGroupedSessions: () => {
        const { data, error, mutate } = useSWR('/sessions', fetcher);

        return {
            sessions: data,
            isLoading: !error && !data,
            isError: error,
            mutate,
        };
    },

    // 直接获取分组会话列表
    getGroupedSessions: async () => {
        const response = await apiClient.get('/sessions');
        return response.data;
    },

    // 统计会话数量
    countSessions: async (params) => {
        const queryParams = new URLSearchParams();
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.range) {
            queryParams.append('range[0]', params.range[0]);
            queryParams.append('range[1]', params.range[1]);
        }

        const url = `/sessions/count${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await apiClient.get(url);
        return response.data;
    },

    // 获取会话排名
    rankSessions: async (limit) => {
        const url = limit ? `/sessions/rank?limit=${limit}` : '/sessions/rank';
        const response = await apiClient.get(url);
        return response.data;
    },

    // 使用 SWR 获取会话排名
    useRankSessions: (limit) => {
        const url = limit ? `/sessions/rank?limit=${limit}` : '/sessions/rank';
        const { data, error, mutate } = useSWR(url, fetcher);

        return {
            rankData: data,
            isLoading: !error && !data,
            isError: error,
            mutate,
        };
    },

    // 更新会话
    updateSession: async (id, data) => {
        const { group, pinned, meta, updatedAt } = data;
        const response = await apiClient.put(`/sessions/${id}`, {
            groupId: group === 'default' ? null : group,
            pinned,
            ...meta,
            updatedAt,
        });
        return response.data;
    },

    // 获取会话配置
    getSessionConfig: async (id) => {
        try {
            const response = await apiClient.get(`/sessions/${id}/config`);
            return response.data;
        } catch (error) {
            console.error('获取会话配置失败', error);
            return DEFAULT_AGENT_CONFIG;
        }
    },

    // 使用 SWR 获取会话配置
    useSessionConfig: (id) => {
        const { data, error, mutate } = useSWR(
            id ? `/sessions/${id}/config` : null,
            fetcher,
            {
                fallbackData: DEFAULT_AGENT_CONFIG,
            }
        );

        return {
            config: data || DEFAULT_AGENT_CONFIG,
            isLoading: !error && !data,
            isError: error,
            mutate,
        };
    },

    // 更新会话配置
    updateSessionConfig: async (id, config, signal) => {
        const response = await apiClient.put(`/sessions/${id}/config`, config, {
            signal,
        });
        return response.data;
    },

    // 更新会话元数据
    updateSessionMeta: async (id, meta, signal) => {
        const response = await apiClient.put(`/sessions/${id}/meta`, meta, {
            signal,
        });
        return response.data;
    },

    // 更新会话聊天配置
    updateSessionChatConfig: async (id, value, signal) => {
        const response = await apiClient.put(`/sessions/${id}/chat-config`, value, {
            signal,
        });
        return response.data;
    },

    // 按类型获取会话
    getSessionsByType: async (type = 'all') => {
        const response = await apiClient.get(`/sessions/type?type=${type}`);
        return response.data;
    },

    // 使用 SWR 按类型获取会话
    useSessionsByType: (type = 'all') => {
        const { data, error, mutate } = useSWR(`/sessions/type?type=${type}`, fetcher);

        return {
            sessions: data,
            isLoading: !error && !data,
            isError: error,
            mutate,
        };
    },

    // 搜索会话
    searchSessions: async (keywords) => {
        const response = await apiClient.get(`/sessions/search?keywords=${encodeURIComponent(keywords)}`);
        return response.data;
    },

    // 使用 SWR 搜索会话
    useSearchSessions: (keywords) => {
        const { data, error, mutate } = useSWR(
            keywords ? `/sessions/search?keywords=${encodeURIComponent(keywords)}` : null,
            fetcher
        );

        return {
            sessions: data,
            isLoading: !error && !data,
            isError: error,
            mutate,
        };
    },

    // 删除会话
    removeSession: async (id) => {
        const response = await apiClient.delete(`/sessions/${id}`);
        return response.data;
    },

    // 删除所有会话
    removeAllSessions: async () => {
        const response = await apiClient.delete('/sessions');
        return response.data;
    },

    // ************************************** //
    // ***********  SessionGroup  *********** //
    // ************************************** //

    // 创建会话组
    createSessionGroup: async (name, sort) => {
        const response = await apiClient.post('/session-groups', { name, sort });
        return response.data;
    },

    // 获取会话组列表
    getSessionGroups: async () => {
        const response = await apiClient.get('/session-groups');
        return response.data;
    },

    // 使用 SWR 获取会话组列表
    useSessionGroups: () => {
        const { data, error, mutate } = useSWR('/session-groups', fetcher);

        return {
            groups: data,
            isLoading: !error && !data,
            isError: error,
            mutate,
        };
    },

    // 批量创建会话组
    batchCreateSessionGroups: async (groups) => {
        const response = await apiClient.post('/session-groups/batch', groups);
        return response.data;
    },

    // 删除会话组
    removeSessionGroup: async (id, removeChildren) => {
        const url = removeChildren ? `/session-groups/${id}?removeChildren=true` : `/session-groups/${id}`;
        const response = await apiClient.delete(url);
        return response.data;
    },

    // 删除所有会话组
    removeSessionGroups: async () => {
        const response = await apiClient.delete('/session-groups');
        return response.data;
    },

    // 更新会话组
    updateSessionGroup: async (id, value) => {
        const response = await apiClient.put(`/session-groups/${id}`, value);
        return response.data;
    },

    // 更新会话组排序
    updateSessionGroupOrder: async (sortMap) => {
        const response = await apiClient.put('/session-groups/order', sortMap);
        return response.data;
    }
};