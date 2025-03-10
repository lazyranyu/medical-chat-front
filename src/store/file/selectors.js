import { uploadSelectors } from './slices/upload/selectors';

/**
 * 文件状态选择器
 * 合并上传相关的选择器
 */
export const fileChatSelectors = {
    ...uploadSelectors,
};