/**
 * 系统状态相关选择器
 */
export const systemStatusSelectors = {
    // 获取输入框高度
    inputHeight: (s) => s.systemStatus.inputHeight,

    // 是否显示聊天侧边栏
    showChatSideBar: (s) => s.systemStatus.showChatSideBar,

    // 是否显示聊天门户
    showPortal: (s) => s.systemStatus.showPortal,

    // 是否显示会话面板
    showSessionPanel: (s) => s.systemStatus.showSessionPanel,

    // 获取会话面板宽度
    sessionWidth: (s) => s.systemStatus.sessionWidth,

    // 是否显示聊天头部
    showChatHeader: (s) => s.systemStatus.showChatHeader,
    
    // 数据库是否已初始化
    isDBInited: (s) => s.systemStatus.isDBInited || true
};