import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

import { createDevtools } from '@/store/middleware/createDevtools';
import { createAuthSlice } from './slices/auth/action';
import { createPreferenceSlice } from './slices/preference/action';
import { createProfileSlice } from './slices/profile/action';
import { createModelProviderSlice } from './slices/modelProvider/action';
import { initialAuthState } from './slices/auth/initialState';
import { initialPreferenceState } from './slices/preference/initialState';
import { initialProfileState } from './slices/profile/initialState';
import { initialModelProviderState } from './slices/modelProvider/initialState';
import {
    authSelectors,
    preferenceSelectors,
    userProfileSelectors,
    modelProviderSelectors
} from './selectors';

// 确保初始状态是完整的
export const initialState = {
    auth: initialAuthState.auth,
    preference: initialPreferenceState.preference,
    profile: initialProfileState.profile,
    models: initialModelProviderState.models,
    currentModelId: initialModelProviderState.currentModelId,
};

/**
 * 创建用户 store
 * 包含用户认证、偏好设置、用户资料和模型提供商相关功能
 */
const createStore = (set, get) => ({
    ...initialState,
    ...createAuthSlice(set, get),
    ...createPreferenceSlice(set, get),
    ...createProfileSlice(set, get),
    ...createModelProviderSlice(set, get),

    /**
     * 重置所有用户状态
     * @param {boolean} [keepAuth=false] - 是否保留认证状态
     */
    resetUserState: (keepAuth = false) => {
        const newState = {
            preference: initialPreferenceState.preference,
            profile: initialProfileState.profile,
            models: initialModelProviderState.models,
            currentModelId: initialModelProviderState.currentModelId,
        };

        if (!keepAuth) {
            newState.auth = initialAuthState.auth;
        }

        set(newState);
    },
});

// 为服务器端渲染创建一个固定的快照对象
// 这个对象在服务器端会被重复使用，避免无限循环
const serverSnapshot = Object.freeze({
    ...initialState,
    // 添加空方法，避免服务器端渲染时报错
    updatePreference: () => {},
    resetUserState: () => {},
});

// 缓存getServerSnapshot的结果
let serverSnapshotCache = null;

/**
 * 用户状态管理
 * 使用 persist 中间件持久化状态
 * 使用 devtools 中间件支持 Redux DevTools
 */
export const useUserStore = create(
    createDevtools('User')(
        persist(
            (...a) => {
                // 创建基本的store
                const store = createStore(...a);

                // 添加服务器端快照函数
                // 在服务器端渲染时，这个函数会被调用
                // 返回一个缓存的对象引用，避免无限循环
                Object.defineProperty(store, 'getServerSnapshot', {
                    value: () => {
                        if (!serverSnapshotCache) {
                            serverSnapshotCache = serverSnapshot;
                        }
                        return serverSnapshotCache;
                    }
                });

                return store;
            },
            {
                name: 'lobe-user',
                partialize: (state) => ({
                    auth: state.auth,
                    preference: state.preference,
                    profile: state.profile,
                    models: state.models,
                    currentModelId: state.currentModelId,
                }),
                version: 1,
            }
        )
    )
);

// 导出选择器
export { authSelectors, preferenceSelectors, userProfileSelectors, modelProviderSelectors };