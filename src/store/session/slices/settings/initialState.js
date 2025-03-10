/**
 * 会话设置相关初始状态
 */
export const initialSessionSettingsState = {
  // 会话设置
  sessionSettings: {
    // 是否启用历史记录
    enableHistory: true,
    // 是否启用自动保存
    enableAutoSave: true,
    // 自动保存间隔（毫秒）
    autoSaveInterval: 30000,
  },
  
  // 设置加载状态
  settingsLoading: false,
  
  // 设置错误信息
  settingsError: null,
}; 