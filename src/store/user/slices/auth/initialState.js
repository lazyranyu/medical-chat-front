/**
 * 用户认证相关初始状态
 */
export const initialAuthState = {
  // 用户认证信息
  auth: {
    // 是否已登录
    isLoggedIn: false,
    // 认证令牌
    token: null,
    // 令牌过期时间
    tokenExpiry: null,
  },
};
