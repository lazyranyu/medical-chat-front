import { initialPortalState } from './initialState';

/**
 * 创建 Portal 相关状态切片
 * @param {Function} set - Zustand 的 set 函数
 * @param {Function} get - Zustand 的 get 函数
 * @returns {Object} Portal 相关状态和动作
 */
export const createPortalSlice = (set, get) => ({
    ...initialPortalState,

    /**
     * 切换 Portal 显示状态
     * @param {boolean} [open] - 是否打开，不传则切换当前状态
     */
    togglePortal: (open) => {
        const showPortal = open === undefined ? !get().showPortal : open;
        set({ showPortal }, false, 'togglePortal');
    },

    /**
     * 打开线程在 Portal 中
     * @param {string} threadId - 线程ID
     * @param {string} [sourceMessageId] - 源消息ID
     */
    openThreadInPortal: (threadId, sourceMessageId) => {
        get().togglePortal(true);
        set({ portalThreadId: threadId }, false, 'openThreadInPortal');
    },

    /**
     * 关闭线程 Portal
     */
    closeThreadPortal: () => {
        set({ portalThreadId: undefined }, false, 'closeThreadPortal');
    },

    /**
     * 打开 Artifact
     * @param {Object} artifact - Artifact 对象
     * @param {string} artifact.id - 消息ID
     * @param {string} artifact.title - 标题
     * @param {string} [artifact.identifier] - 标识符
     * @param {string} [artifact.type] - 类型
     * @param {string} [artifact.language] - 代码语言
     */
    openArtifact: (artifact) => {
        get().togglePortal(true);
        set({ portalArtifact: artifact }, false, 'openArtifact');
    },

    /**
     * 关闭 Artifact
     */
    closeArtifact: () => {
        get().togglePortal(false);
        set({ portalArtifact: undefined }, false, 'closeArtifact');
    },

    /**
     * 打开文件预览
     * @param {Object} portal - 文件预览对象
     * @param {string} portal.fileId - 文件ID
     * @param {string} [portal.chunkId] - 文件块ID
     * @param {string} [portal.chunkText] - 文件块文本
     */
    openFilePreview: (portal) => {
        get().togglePortal(true);
        set({ portalFile: portal }, false, 'openFilePreview');
    },

    /**
     * 关闭文件预览
     */
    closeFilePreview: () => {
        set({ portalFile: undefined }, false, 'closeFilePreview');
    },

    /**
     * 打开消息详情
     * @param {string} messageId - 消息ID
     */
    openMessageDetail: (messageId) => {
        get().togglePortal(true);
        set({ portalMessageDetail: messageId }, false, 'openMessageDetail');
    },

    /**
     * 关闭消息详情
     */
    closeMessageDetail: () => {
        set({ portalMessageDetail: undefined }, false, 'closeMessageDetail');
    },

    /**
     * 打开工具UI
     * @param {string} id - 消息ID
     * @param {string} identifier - 标识符
     */
    openToolUI: (id, identifier) => {
        get().togglePortal(true);
        set({ portalToolMessage: { id, identifier } }, false, 'openToolUI');
    },

    /**
     * 关闭工具UI
     */
    closeToolUI: () => {
        set({ portalToolMessage: undefined }, false, 'closeToolUI');
    },
}); 