/**
 * 用户配置文件相关选择器
 */
export const profileSelectors = {
    // 获取用户头像 - 安全访问
    avatar: (s) => (s.profile && s.profile.avatar) || null,

    // 获取用户名 - 安全访问
    username: (s) => (s.profile && s.profile.username) || '用户',

    // 获取用户ID - 安全访问
    userId: (s) => (s.profile && s.profile.id) || null,

    // 获取用户邮箱 - 安全访问
    userEmail: (s) => (s.profile && s.profile.email) || null,

    // 获取用户头像 - 安全访问
    userAvatar: (s) => (s.profile && s.profile.avatar) || null,
};