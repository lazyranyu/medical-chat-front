// sort-imports-ignore
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { initialState } from './initialState';
import { createMessageSlice } from './slices/message/action';
import { createGenerationSlice } from './slices/generation/action';
import { createThreadSlice } from './slices/thread/action';
import { createPortalSlice } from './slices/portal/action';

// 定义 ChatStore 类型
export const createStore = (...params) => ({
  ...initialState,

  ...createMessageSlice(...params),
  ...createGenerationSlice(...params),
  ...createThreadSlice(...params),
  ...createPortalSlice(...params),

  // 可以根据需要添加其他 slice
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('chat');

export const useChatStore = createWithEqualityFn(
  subscribeWithSelector(devtools(createStore)),
  shallow,
); 