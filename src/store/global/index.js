import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

import { createDevtools } from '@/store/middleware/createDevtools';
import { createSystemStatusSlice } from './slices/systemStatus/action';
import { initialSystemStatusState } from './slices/systemStatus/initialState';
import { systemStatusSelectors } from './selectors';
import { globalActionSlice } from './action';

// 初始状态
export const initialState = {
    ...initialSystemStatusState,
};

/**
 * 创建全局 store
 * 包含系统状态相关功能
 */
const createStore = (set, get) => {
    // 创建系统状态切片
    const systemStatusSlice = createSystemStatusSlice(set, get);
    
    return {
        ...initialState,
        ...systemStatusSlice,
        // 将updateSystemStatus方法提升到顶层，方便组件直接访问
        updateSystemStatus: systemStatusSlice.updateSystemStatus,
    };
};

// 为服务器端渲染创建一个固定的快照对象
// 这个对象在服务器端会被重复使用，避免无限循环
const serverSnapshot = Object.freeze({
    systemStatus: {
        inputHeight: 350,
        showChatSideBar: true,
        showPortal: false,
        showSessionPanel: true,
        sessionWidth: 280,
        showChatHeader: true
    },
    // 添加一个空的updateSystemStatus方法，避免服务器端渲染时报错
    updateSystemStatus: () => {},
});

// 缓存getServerSnapshot的结果
let serverSnapshotCache = null;

/**
 * 全局 UI 状态管理
 * 使用 persist 中间件持久化状态
 * 使用 devtools 中间件支持 Redux DevTools
 */
export const useGlobalStore = create(
    createDevtools('Global')(
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
                name: 'lobe-global',
            }
        )
    )
);

// 导出选择器和操作
export { systemStatusSelectors, globalActionSlice };