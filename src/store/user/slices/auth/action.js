import { initialAuthState } from './initialState';

/**
 * 创建用户认证相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} 用户认证相关状态和动作
 */
export const createAuthSlice = (set, get) => ({
  ...initialAuthState,

  /**
   * 设置登录状态
   * @param {boolean} isLoggedIn - 是否已登录
   * @param {Object} authInfo - 认证信息
   */
  setLoginStatus: (isLoggedIn, authInfo = {}) => set((state) => {
    // 确保 state.auth 存在
    const currentAuth = state.auth || initialAuthState.auth;
    
    return {
      auth: {
        ...currentAuth,
        isLoggedIn,
        ...(isLoggedIn ? authInfo : { token: null, tokenExpiry: null }),
      },
    };
  }),

  /**
   * 登录
   * @param {string} token - 认证令牌
   * @param {Date|string} tokenExpiry - 令牌过期时间
   */
  login: (token, tokenExpiry) => {
    const expiry = typeof tokenExpiry === 'string' ? new Date(tokenExpiry) : tokenExpiry;
    
    set((state) => {
      // 确保 state.auth 存在
      const currentAuth = state.auth || initialAuthState.auth;
      
      return {
        auth: {
          ...currentAuth,
          isLoggedIn: true,
          token,
          tokenExpiry: expiry,
        },
      };
    });
  },

  /**
   * 登出
   */
  logout: () => set((state) => {
    // 确保 state.auth 存在
    const currentAuth = state.auth || initialAuthState.auth;
    
    return {
      auth: {
        ...currentAuth,
        isLoggedIn: false,
        token: null,
        tokenExpiry: null,
      },
    };
  }),

  /**
   * 重置认证状态
   */
  resetAuth: () => set({ auth: initialAuthState.auth }),
});
