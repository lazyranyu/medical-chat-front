import { t } from "i18next"
import { sha256 } from "js-sha256"

import { LOBE_CHAT_CLOUD } from "@/const/branding"
import { isServerMode } from "@/const/version"
import { fileService } from "@/api/file"
import { uploadService } from "@/api/upload"

/**
 * 创建文件上传切片，包含带进度上传功能
 * @returns {Object} 返回包含 uploadWithProgress 方法的对象
 */
export const createFileUploadSlice = () => ({
  /**
   * 带进度回调的文件上传方法
   * @param {Object} params 参数对象
   * @param {File} params.file 需要上传的文件对象
   * @param {Function} [params.onStatusUpdate] 上传状态更新回调函数
   * @param {string} [params.knowledgeBaseId] 知识库ID（用于文件关联）
   * @param {boolean} [params.skipCheckFileType] 是否跳过文件类型检查
   * @returns {Promise<Object>} 返回上传完成的文件数据对象
   */
  uploadWithProgress: async ({
                               file,
                               onStatusUpdate,
                               knowledgeBaseId,
                               skipCheckFileType
                             }) => {
    // 将文件转换为 ArrayBuffer 用于哈希计算
    const fileArrayBuffer = await file.arrayBuffer()

    /* --- 文件哈希校验阶段 --- */
    const hash = sha256(fileArrayBuffer)
    const checkStatus = await fileService.checkFileHash(hash)
    let metadata

    /* --- 文件存在性处理分支 --- */
    if (checkStatus.isExist) {
      // 当文件已存在时直接使用现有元数据，跳过上传
      metadata = checkStatus.metadata
      onStatusUpdate?.({
        id: file.name,
        type: "updateFile",
        value: {
          status: "processing",
          uploadState: { progress: 100, restTime: 0, speed: 0 }
        }
      })
    } else {
      /* --- 服务器模式文件上传 --- */
      metadata = await uploadService.uploadWithProgress(file, {
        onProgress: (status, upload) => {
          onStatusUpdate?.({
            id: file.name,
            type: "updateFile",
            value: {
              status: status === "success" ? "processing" : status,
              uploadState: upload
            }
          })
        }
      })
    }

    /* --- 文件类型检测增强 --- */
    let fileType = file.type
    if (!file.type) {
      // 使用 file-type 库进行二进制类型检测
      const { fileTypeFromBuffer } = await import("file-type")
      const type = await fileTypeFromBuffer(fileArrayBuffer)
      fileType = type?.mime || "text/plain"
    }

    /* --- 文件记录创建阶段 --- */
    const data = await fileService.createFile(
        {
          fileType,
          hash,
          metadata,
          name: file.name,
          size: file.size,
          url: metadata.path
        },
        knowledgeBaseId
    )

    // 最终状态更新通知
    onStatusUpdate?.({
      id: file.name,
      type: "updateFile",
      value: {
        fileUrl: data.url,
        id: data.id,
        status: "success",
        uploadState: { progress: 100, restTime: 0, speed: 0 }
      }
    })

    return data
  }
})

