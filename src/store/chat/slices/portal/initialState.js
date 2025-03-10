/**
 * Portal 相关初始状态
 */

/**
 * @typedef {Object} PortalFile
 * @property {string} [chunkId] - 文件块ID
 * @property {string} [chunkText] - 文件块文本
 * @property {string} fileId - 文件ID
 */

/**
 * @typedef {Object} PortalArtifact
 * @property {string} id - 消息ID
 * @property {string} title - 标题
 * @property {string} [identifier] - 标识符
 * @property {string} [type] - 类型
 * @property {string} [language] - 代码语言
 */

/**
 * Portal 初始状态
 */
export const initialPortalState = {
    // 是否显示 Portal
    showPortal: false,
    
    // Portal 中的 Artifact
    portalArtifact: undefined,
    
    // Portal Artifact 显示模式：'code' | 'preview'
    portalArtifactDisplayMode: 'preview',
    
    // Portal 中的文件
    portalFile: undefined,
    
    // Portal 中的消息详情
    portalMessageDetail: undefined,
    
    // Portal 中的线程ID
    portalThreadId: undefined,
    
    // Portal 中的工具消息
    portalToolMessage: undefined,
}; 