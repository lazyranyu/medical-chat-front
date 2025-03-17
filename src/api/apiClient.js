import axios from 'axios';

// 创建通用axios实例
export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 允许跨域携带cookie
});


// 通用的fetcher函数用于SWR
export const fetcher = (url) => apiClient.get(url).then((res) => res.data);

export default apiClient; 