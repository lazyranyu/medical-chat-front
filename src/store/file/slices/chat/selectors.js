import { UPLOAD_STATUS_SET } from "@/types/files/upload"

const chatUploadFileList = s => s.chatUploadFileList
const isImageUploading = s => s.uploadingIds.length > 0

const chatRawFileList = s => s.chatUploadFileList.map(item => item.file)
const chatUploadFileListHasItem = s => s.chatUploadFileList.length > 0

const isUploadingFiles = s =>
    s.chatUploadFileList.some(
        file =>
            // is file status in uploading
            UPLOAD_STATUS_SET.has(file.status) ||
            // or file has tasks but not finish embedding
            (file.tasks && !file.tasks?.finishEmbedding)
    )

export const filesSelectors = {
  chatUploadFileList,
  isImageUploading
}

export const fileChatSelectors = {
  chatRawFileList,
  chatUploadFileList,
  chatUploadFileListHasItem,
  isUploadingFiles
}
