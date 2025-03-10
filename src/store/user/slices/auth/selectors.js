/**
 * 用户认证相关选择器
 */
export const authSelectors = {
  // 是否已登录 - 避免使用可选链
  isLoggedIn: (s) => Boolean(s.auth && s.auth.isLoggedIn),

  // 兼容旧代码 - 避免直接访问可能不存在的属性
  isLogin: (s) => Boolean(s.auth && s.auth.isLoggedIn),

  // 获取认证令牌 - 使用安全访问
  token: (s) => (s.auth && s.auth.token) || null,

  // 获取令牌过期时间 - 使用安全访问
  tokenExpiry: (s) => (s.auth && s.auth.tokenExpiry) || null,

  // 令牌是否有效 - 使用安全访问
  isTokenValid: (s) => {
    if (!s.auth || !s.auth.token || !s.auth.tokenExpiry) return false;
    
    const expiry = new Date(s.auth.tokenExpiry);
    return expiry > new Date();
  },
};