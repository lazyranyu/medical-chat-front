// sort-imports-ignore
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { initialState } from './initialState';
import { createAgentSettingsSlice } from './slices/settings/action';

// 定义 AgentStore 类型
export const createStore = (...params) => ({
  ...initialState,

  ...createAgentSettingsSlice(...params),

  // 可以根据需要添加其他 slice
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('agent');

export const useAgentStore = createWithEqualityFn(
  subscribeWithSelector(devtools(createStore)),
  shallow,
); 