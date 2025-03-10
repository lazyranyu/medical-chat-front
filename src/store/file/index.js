import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { subscribeWithSelector } from 'zustand/middleware';

import { createDevtools } from '@/store/middleware/createDevtools';
import { createUploadSlice } from './slices/upload/action';
import { initialUploadState } from './slices/upload/initialState';
import { fileChatSelectors } from './selectors';

// 用于缓存选择器结果的 memoize 函数
const memoize = (fn) => {
  let lastArgs = null;
  let lastResult = null;

  return (...args) => {
    if (lastArgs !== null && args.length === lastArgs.length && args.every((arg, i) => arg === lastArgs[i])) {
      return lastResult;
    }

    lastArgs = args;
    lastResult = fn(...args);
    return lastResult;
  };
};

// 初始状态
export const initialState = {
    ...initialUploadState,
};

/**
 * 创建文件 store
 * 包含文件上传相关功能
 */
const createStore = (set, get) => {
  // 创建基本的 store 状态和动作
  const baseStore = {
    ...initialState,
    
    // 上传聊天文件
    uploadChatFiles: async (files) => {
      set({ isUploadingFiles: true });

      try {
        // 模拟文件上传
        await new Promise(resolve => setTimeout(resolve, 500));

        const newFiles = Array.from(files).map(file => ({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadState: 'success',
        }));

        set((state) => ({
          chatUploadFileList: [...state.chatUploadFileList, ...newFiles],
          isUploadingFiles: false,
        }));

        // 使用 setTimeout 延迟更新 chat store 的状态
        setTimeout(() => {
          try {
            // 动态导入 chat store
            const { useChatStore } = require('../chat');
            useChatStore.setState({ hasUploadedFiles: true });
          } catch (error) {
            console.error('更新 chat store 失败:', error);
          }
        }, 0);

        return newFiles;
      } catch (error) {
        console.error('上传文件失败:', error);
        set({ isUploadingFiles: false });
        throw error;
      }
    },

    // 移除聊天上传文件
    removeChatUploadFile: (id) => {
      set((state) => {
        const newList = state.chatUploadFileList.filter(file => file.id !== id);

        // 如果没有文件了，更新聊天 store 中的 hasUploadedFiles 状态
        if (newList.length === 0) {
          setTimeout(() => {
            try {
              // 动态导入 chat store
              const { useChatStore } = require('../chat');
              useChatStore.setState({ hasUploadedFiles: false });
            } catch (error) {
              console.error('更新 chat store 失败:', error);
            }
          }, 0);
        }

        return { chatUploadFileList: newList };
      });
    },

    // 清空聊天上传文件列表
    clearChatUploadFileList: () => {
      set({ chatUploadFileList: [] });

      setTimeout(() => {
        try {
          // 动态导入 chat store
          const { useChatStore } = require('../chat');
          useChatStore.setState({ hasUploadedFiles: false });
        } catch (error) {
          console.error('更新 chat store 失败:', error);
        }
      }, 0);
    },
  };

  // 添加其他 slice
  return {
    ...baseStore,
    ...createUploadSlice(set, get),
  };
};

// 为服务器端渲染创建一个固定的快照对象
// 这个对象在服务器端会被重复使用，避免无限循环
const serverSnapshot = Object.freeze({
  ...initialState,
  // 添加空方法，避免服务器端渲染时报错
  uploadChatFiles: () => Promise.resolve([]),
  removeChatUploadFile: () => {},
  clearChatUploadFileList: () => {},
  chatUploadFileList: [],
  isUploadingFiles: false,
});

// 缓存getServerSnapshot的结果
let serverSnapshotCache = null;

/**
 * 文件状态管理
 * 使用 subscribeWithSelector 中间件支持选择器订阅
 * 使用 devtools 中间件支持 Redux DevTools
 */
export const useFileStore = create(
  subscribeWithSelector(
    createDevtools('File')((...a) => {
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
    })
  )
);

// 创建稳定的选择器
export const fileStableSelectors = {
  // 获取上传文件函数
  getUploadChatFiles: memoize((state) => state.uploadChatFiles),
  
  // 获取移除文件函数
  getRemoveChatUploadFile: memoize((state) => state.removeChatUploadFile),
  
  // 获取清空文件列表函数
  getClearChatUploadFileList: memoize((state) => state.clearChatUploadFileList),
  
  // 获取聊天上传文件列表
  getChatUploadFileList: memoize((state) => state.chatUploadFileList),
  
  // 判断是否正在上传文件
  getIsUploadingFiles: memoize((state) => state.isUploadingFiles),
};

// 导出选择器和 shallow 比较函数
export { fileChatSelectors, shallow };