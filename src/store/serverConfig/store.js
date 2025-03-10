// sort-imports-ignore
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';

// 初始状态
export const initialState = {
  // 服务器配置
  serverConfig: {
    // API 基础 URL
    apiBaseUrl: '/api',
    // 是否启用 WebSocket
    enableWebSocket: false,
    // WebSocket URL
    webSocketUrl: '',
    // 是否启用 HTTPS
    enableHttps: false,
    // 是否启用认证
    enableAuth: false,
  },
  
  // 配置加载状态
  configLoading: false,
  
  // 配置错误信息
  configError: null,
};

// 创建 store
const createStore = (set, get) => ({
  ...initialState,
  
  /**
   * 更新服务器配置
   * @param {Object} updates - 更新内容
   */
  updateServerConfig: (updates) => {
    set((state) => ({
      serverConfig: {
        ...state.serverConfig,
        ...updates
      }
    }));
  },
  
  /**
   * 设置 API 基础 URL
   * @param {string} url - API 基础 URL
   */
  setApiBaseUrl: (url) => {
    set((state) => ({
      serverConfig: {
        ...state.serverConfig,
        apiBaseUrl: url
      }
    }));
  },
  
  /**
   * 设置是否启用 WebSocket
   * @param {boolean} enable - 是否启用
   */
  setEnableWebSocket: (enable) => {
    set((state) => ({
      serverConfig: {
        ...state.serverConfig,
        enableWebSocket: enable
      }
    }));
  },
  
  /**
   * 设置 WebSocket URL
   * @param {string} url - WebSocket URL
   */
  setWebSocketUrl: (url) => {
    set((state) => ({
      serverConfig: {
        ...state.serverConfig,
        webSocketUrl: url
      }
    }));
  },
  
  /**
   * 设置是否启用 HTTPS
   * @param {boolean} enable - 是否启用
   */
  setEnableHttps: (enable) => {
    set((state) => ({
      serverConfig: {
        ...state.serverConfig,
        enableHttps: enable
      }
    }));
  },
  
  /**
   * 设置是否启用认证
   * @param {boolean} enable - 是否启用
   */
  setEnableAuth: (enable) => {
    set((state) => ({
      serverConfig: {
        ...state.serverConfig,
        enableAuth: enable
      }
    }));
  },
  
  /**
   * 设置配置加载状态
   * @param {boolean} loading - 加载状态
   */
  setConfigLoading: (loading) => {
    set({ configLoading: loading });
  },
  
  /**
   * 设置配置错误信息
   * @param {string|null} error - 错误信息
   */
  setConfigError: (error) => {
    set({ configError: error });
  }
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('serverConfig');

export const useServerConfigStore = createWithEqualityFn(
  subscribeWithSelector(devtools(createStore)),
  shallow,
); 