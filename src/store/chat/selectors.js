import { messageSelectors } from './slices/message/selectors';
import { generationSelectors } from './slices/generation/selectors';
import { threadSelectors } from './slices/thread/selectors';
import { chatPortalSelectors } from './slices/portal/selectors';

// 合并 messageSelectors 和 generationSelectors 中的 isAIGenerating 选择器
export const chatSelectors = {
  ...messageSelectors,
  isAIGenerating: generationSelectors.isAIGenerating,
};

export { generationSelectors };
export { threadSelectors };
export { chatPortalSelectors }; 