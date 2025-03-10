/**
 * 文件上传相关选择器
 */
export const uploadSelectors = {
    // 获取聊天上传文件列表
    chatUploadFileList: (s) => s.chatUploadFileList,

    // 判断聊天上传文件列表是否有文件
    chatUploadFileListHasItem: (s) => s.chatUploadFileList.length > 0,

    // 是否正在上传文件
    isUploadingFiles: (s) => s.isUploadingFiles,
};