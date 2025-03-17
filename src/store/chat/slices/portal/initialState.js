/**
 * 聊天门户切片 - 初始状态
 * 
 * 定义了聊天门户(Portal)相关的初始状态
 * 门户是一个弹出式界面，用于显示详细内容、代码、文件等
 */

/**
 * 门户文件类型定义
 * 
 * @typedef {Object} PortalFile
 * @property {string} [chunkId] - 文件块ID，用于定位文件的特定部分
 * @property {string} [chunkText] - 文件块文本内容
 * @property {string} fileId - 文件ID，唯一标识一个文件
 */

/**
 * 门户产物类型定义
 * 产物是AI生成的代码、图表等内容
 * 
 * @typedef {Object} PortalArtifact
 * @property {string} id - 产物ID，通常与消息ID相关联
 * @property {string} title - 产物标题
 * @property {string} [identifier] - 产物标识符，如文件名
 * @property {string} [type] - 产物类型，如代码、图表等
 * @property {string} [language] - 代码语言，用于代码高亮显示
 */

/**
 * 门户初始状态
 * 定义了门户组件的默认状态
 */
export const initialPortalState = {
    // 是否显示门户
    // 控制门户组件的可见性
    showPortal: false,
    
    // 门户中显示的产物
    // 当用户查看AI生成的代码、图表等内容时使用
    portalArtifact: undefined,
    
    // 门户产物显示模式
    // 'code': 显示代码视图
    // 'preview': 显示预览视图
    portalArtifactDisplayMode: 'preview',
    
    // 门户中显示的文件
    // 当用户查看上传的文件或引用的文件时使用
    portalFile: undefined,
    
    // 门户中显示的消息详情
    // 用于展示消息的完整内容和元数据
    portalMessageDetail: undefined,
    
    // 门户中的线程ID
    // 用于关联门户内容与特定的对话线程
    portalThreadId: undefined,
    
    // 门户中显示的工具消息
    // 用于展示AI工具调用的详细信息
    portalToolMessage: undefined,
}; 