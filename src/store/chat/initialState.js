// sort-imports-ignore
import { initialMessageState } from './slices/message/initialState';
import { initialGenerationState } from './slices/generation/initialState';
import { initialThreadState } from './slices/thread/initialState';
import { initialPortalState } from './slices/portal/initialState';

export const initialState = {
  ...initialMessageState,
  ...initialGenerationState,
  ...initialThreadState,
  ...initialPortalState,
  
  // 可以根据需要添加其他状态
}; 