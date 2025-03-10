// sort-imports-ignore
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { initialState } from './initialState';
import { createSessionListSlice } from './slices/list/action';
import { createSessionSettingsSlice } from './slices/settings/action';

// 定义 SessionStore 类型
export const createStore = (...params) => ({
  ...initialState,

  ...createSessionListSlice(...params),
  ...createSessionSettingsSlice(...params),

  // 可以根据需要添加其他 slice
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('session');

export const useSessionStore = createWithEqualityFn(
  subscribeWithSelector(devtools(createStore)),
  shallow,
); 