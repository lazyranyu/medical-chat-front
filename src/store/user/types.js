/**
 * @typedef {Object} UserProfile
 * @property {string|null} avatar - 用户头像URL
 * @property {string} username - 用户名
 * @property {string|null} id - 用户ID
 * @property {string|null} email - 用户邮箱
 */

/**
 * @typedef {Object} UserPreference
 * @property {boolean} useCmdEnterToSend - 是否使用Cmd+Enter发送消息
 * @property {string} [theme] - 主题设置
 * @property {string} [language] - 语言设置
 */

/**
 * @typedef {Object} UserAuth
 * @property {boolean} isLoggedIn - 是否已登录
 * @property {string|null} token - 认证令牌
 * @property {Date|null} tokenExpiry - 令牌过期时间
 */

/**
 * @typedef {Object} ModelProvider
 * @property {string} id - 提供商ID
 * @property {string} name - 提供商名称
 * @property {string} apiKey - API密钥
 * @property {boolean} isEnabled - 是否启用
 */

/**
 * @typedef {Object} UserState
 * @property {UserProfile} profile - 用户资料
 * @property {UserPreference} preference - 用户偏好设置
 * @property {UserAuth} auth - 用户认证信息
 * @property {ModelProvider[]} modelProviders - 模型提供商列表
 */ 