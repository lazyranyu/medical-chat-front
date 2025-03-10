/**
 * Portal 相关选择器
 */

// 定义 Artifact 标签正则表达式
const ARTIFACT_TAG_REGEX = /<artifact(?:\s+[^>]+)?>([\s\S]*?)<\/artifact>/;
const ARTIFACT_TAG_CLOSED_REGEX = /<\/artifact>/;

/**
 * Portal 选择器
 */
export const chatPortalSelectors = {
    // 是否显示 Portal
    showPortal: (s) => s.showPortal,

    // 消息详情相关
    showMessageDetail: (s) => !!s.portalMessageDetail,
    messageDetailId: (s) => s.portalMessageDetail,

    // 插件 UI 相关
    showPluginUI: (s) => !!s.portalToolMessage,
    toolMessageId: (s) => s.portalToolMessage?.id,
    isPluginUIOpen: (id) => (s) => chatPortalSelectors.toolMessageId(s) === id && chatPortalSelectors.showPortal(s),
    toolUIIdentifier: (s) => s.portalToolMessage?.identifier,

    // 文件预览相关
    showFilePreview: (s) => !!s.portalFile,
    previewFileId: (s) => s.portalFile?.fileId,
    chunkText: (s) => s.portalFile?.chunkText,

    // Artifact 相关
    showArtifactUI: (s) => !!s.portalArtifact,
    artifactTitle: (s) => s.portalArtifact?.title,
    artifactIdentifier: (s) => s.portalArtifact?.identifier || '',
    artifactMessageId: (s) => s.portalArtifact?.id,
    artifactType: (s) => s.portalArtifact?.type,
    artifactCodeLanguage: (s) => s.portalArtifact?.language,

    // 获取 Artifact 消息内容
    artifactMessageContent: (id) => (s) => {
        const message = s.messages.find(msg => msg.id === id);
        return message?.content || '';
    },

    // 获取 Artifact 代码
    artifactCode: (id) => (s) => {
        const messageContent = chatPortalSelectors.artifactMessageContent(id)(s);
        const result = messageContent.match(ARTIFACT_TAG_REGEX);
        return result?.[1] || '';
    },

    // 判断 Artifact 标签是否已关闭
    isArtifactTagClosed: (id) => (s) => {
        const content = chatPortalSelectors.artifactMessageContent(id)(s);
        return ARTIFACT_TAG_CLOSED_REGEX.test(content || '');
    },
}; 