import { apiClient, fetcher } from '../apiClient';

export const fileService = {
    /**
     * 创建文件
     * @param file 文件信息
     */
    createFile: async file => {
        const { data } = await apiClient.post(`files/create`, file)
        return data
    },

    /**
     * 获取文件详情
     * @param id 文件ID
     */
    getFile: async id => {
        const { data } = await apiClient.get(`files/${id}`)
        return data
    },

    /**
     * 删除单个文件
     * @param id 文件ID
     */
    removeFile: async id => {
        await apiClient.delete(`files/${id}`, {
            params: { removeGlobalFile: false }
        })
    },

    /**
     * 批量删除文件
     * @param ids 文件ID数组
     */
    removeFiles: async ids => {
        await apiClient.delete(`files/batch`, {
            data: { ids, removeGlobalFile: false }
        })
    },

    /**
     * 清空所有文件
     */
    removeAllFiles: async () => {
        await apiClient.delete(`files/all`)
    },

    /**
     * 检查文件哈希是否存在
     * @param hash 文件哈希值
     */
    checkFileHash: async hash => {
        const { data } = await apiClient.get(`files/hash/${hash}`)
        return data
    },

    /**
     * 获取文件的Base64编码
     * @param hash 文件哈希值
     */
    getBase64ByFileHash: async hash => {
        const { data } = await apiClient.get(`files/base64/${hash}`)
        return data
    }
}
