import { initialUploadState } from './initialState';

/**
 * 创建文件上传相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 文件上传相关状态和动作
 */
export const createUploadSlice = (set, get) => ({
    ...initialUploadState,
    
    /**
     * 获取上传文件的总大小
     * @returns {number} 总大小（字节）
     */
    getTotalUploadSize: () => {
        const state = get();
        return state.chatUploadFileList.reduce((total, file) => total + file.size, 0);
    },
    
    /**
     * 获取上传文件的数量
     * @returns {number} 文件数量
     */
    getUploadFileCount: () => {
        return get().chatUploadFileList.length;
    },
});