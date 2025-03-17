/**
 * 用户偏好设置相关选择器
 */
export const preferenceSelectors = {
    // 获取用户偏好设置
    preference: (s) => s.preference,
    
    // 获取主题
    theme: (s) => s.preference.theme,
    
    // 获取语言
    language: (s) => s.preference.language,
    
    // 是否使用 Cmd+Enter 发送消息
    useCmdEnterToSend: (s) => s.preference.useCmdEnterToSend,
    
    // 获取主题显示模式
    topicDisplayMode: (s) => s.preference.topicDisplayMode || 'byTime',
};