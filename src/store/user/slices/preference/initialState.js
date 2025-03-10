/**
 * 用户偏好设置相关初始状态
 */
export const initialPreferenceState = {
    // 用户偏好设置
    preference: {
        // 主题：light, dark, auto
        theme: 'auto',
        
        // 语言：zh-CN, en-US, auto
        language: 'auto',
        
        // 是否使用 Cmd+Enter 发送消息
        useCmdEnterToSend: true,
        
        // 字体大小：small, medium, large
        fontSize: 'medium',
        
        // 中性色：gray, neutral
        neutralColor: 'gray',
        
        // 主色：blue, green, purple, etc.
        primaryColor: 'blue',
    },
};