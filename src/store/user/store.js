// 引入 zustand 相关的中间件和函数
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

// 引入自定义的开发工具中间件
import { createDevtools } from '../middleware/createDevtools';
// 引入初始状态和各个状态切片的创建函数
import { initialState } from './initialState';
import { createAuthSlice } from './slices/auth/action';
// import { createCommonSlice } from './slices/common/action';
// import { createModelListSlice } from './slices/modelList/action';
// import { createPreferenceSlice } from './slices/preference/action';
// import { createSettingsSlice } from './slices/settings/action';
// import { createSyncSlice } from './slices/sync/action';

// 定义 createStore 函数，用于创建和合并所有状态切片
const createStore = (...parameters) => ({
    ...initialState,
    // ...createSyncSlice(...parameters),
    // ...createSettingsSlice(...parameters),
    // ...createPreferenceSlice(...parameters),
    ...createAuthSlice(...parameters),
    // ...createCommonSlice(...parameters),
    // ...createModelListSlice(...parameters),
});

// 使用 createDevtools 增强 createStore 函数
const devtools = createDevtools('user');

// 创建 useUserStore hook，使用 createWithEqualityFn 和 subscribeWithSelector 来优化性能
export const useUserStore = createWithEqualityFn()(
    subscribeWithSelector(devtools(createStore)),
    shallow,
);