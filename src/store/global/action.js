/**
 * 全局状态操作
 * 导出所有全局状态相关的操作
 */
import { createSystemStatusSlice } from './slices/systemStatus/action';

/**
 * 创建全局状态操作切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 全局状态操作
 */
export const globalActionSlice = {
    createSystemStatusSlice,
};