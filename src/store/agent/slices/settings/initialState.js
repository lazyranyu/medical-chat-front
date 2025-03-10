/**
 * 代理设置相关初始状态
 */
export const initialAgentSettingsState = {
  // 代理设置
  settings: {
    // 模型设置
    model: 'gpt-3.5-turbo',
    // 温度
    temperature: 0.7,
    // 最大响应令牌数
    maxResponseTokens: 2000,
  },
  
  // 设置加载状态
  settingsLoading: false,
  
  // 设置错误信息
  settingsError: null,
}; 