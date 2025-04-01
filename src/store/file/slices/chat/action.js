import { t } from "i18next"

import { notification } from "@/components/AntdStaticMethods"
import { fileService } from "@/api/file"
import { UPLOAD_NETWORK_ERROR } from "@/api/upload"
// import { userService } from "@/api/user"
// import { useAgentStore } from "@/store/agent"
import { uploadFileListReducer } from "@/store/file/reducers/uploadFileList"
// import { useUserStore } from "@/store/user"
// import { preferenceSelectors } from "@/store/user/selectors"
import { isChunkingUnsupported } from "@/utils/isChunkingUnsupported"
import { sleep } from "@/utils/sleep"
import { setNamespace } from "@/utils/storeDebug"

const n = setNamespace("chat")
/**
 * 创建文件管理模块的 Zustand 状态切片
 * @param {Function} set - Zustand 状态管理器的 set 方法
 * @param {Function} get - Zustand 状态管理器的 get 方法
 * @returns {Object} 包含多个文件操作方法的状态切片对象
 */
export const createFileSlice = (set, get) => ({
  /**
   * 清空聊天文件上传列表
   */
  clearChatUploadFileList: () => {
    set({ chatUploadFileList: [] }, false, n("clearChatUploadFileList"))
  },

  /**
   * 分发聊天文件上传列表操作
   * @param {Object} payload - 操作载荷，包含操作类型和数据
   * @param {string} payload.type - 操作类型（如 "addFiles", "removeFile"）
   * @param {Array|string} payload.files - 要添加的文件列表
   * @param {string} payload.id - 要操作的文件ID
   */
  dispatchChatUploadFileList: payload => {
    const nextValue = uploadFileListReducer(get().chatUploadFileList, payload)
    if (nextValue === get().chatUploadFileList) return

    set(
        { chatUploadFileList: nextValue },
        false,
        `dispatchChatFileList/${payload.type}`
    )
  },

  /**
   * 移除聊天上传文件
   * @param {string} id - 要移除的文件ID
   */
  removeChatUploadFile: async id => {
    const { dispatchChatUploadFileList } = get()

    dispatchChatUploadFileList({ id, type: "removeFile" })
    await fileService.removeFile(id)
  },

  /**
   * 启动异步任务并轮询状态更新
   * @param {string} id - 文件ID
   * @param {Function} runner - 异步任务执行函数
   * @param {Function} onFileItemUpdate - 文件状态更新回调
   */
  startAsyncTask: async (id, runner, onFileItemUpdate) => {
    await runner(id)

    let isFinished = false

    // 轮询任务状态直到完成或出错
    while (!isFinished) {
      await sleep(2000)

      let fileItem = undefined

      try {
        fileItem = await fileService.getFileItem(id)
      } catch (e) {
        console.error("getFileItem Error:", e)
        continue
      }

      if (!fileItem) return

      onFileItemUpdate(fileItem)

      // 判断任务完成条件
      if (fileItem.finishEmbedding) {
        isFinished = true
      } else if (
          fileItem.chunkingStatus === "error" ||
          fileItem.embeddingStatus === "error"
      ) {
        isFinished = true
      }
    }
  },

  /**
   * 上传聊天文件并进行后续处理
   * @param {File[]} rawFiles - 要上传的原始文件列表
   */
  uploadChatFiles: async rawFiles => {
    const { dispatchChatUploadFileList, startAsyncTask } = get()

    const files = rawFiles

    // 生成预览和base64数据
    const uploadFiles = await Promise.all(
        files.map(async file => {
          let previewUrl, base64Url

          if (file.type.startsWith("image") || file.type.startsWith("video")) {
            const data = await file.arrayBuffer()
            previewUrl = URL.createObjectURL(new Blob([data], { type: file.type }))
            base64Url = `data:${file.type};base64,${Buffer.from(data).toString("base64")}`
          }

          return {
            base64Url,
            file,
            id: file.name,
            previewUrl,
            status: "pending"
          }
        })
    )

    dispatchChatUploadFileList({ files: uploadFiles, type: "addFiles" })

    // 并行处理文件上传和后续操作
    const pools = files.map(async file => {
      let fileResult
      try {
        // 带进度上传文件
        fileResult = await get().uploadWithProgress({
          file,
          onStatusUpdate: dispatchChatUploadFileList
        })
      } catch (error) {
        // 错误处理逻辑
        if (error?.message !== "UNAUTHORIZED") {
          const description = error === UPLOAD_NETWORK_ERROR
              ? t("upload.networkError", { ns: "error" })
              : typeof error === "string"
                  ? error
                  : t("upload.unknownError", { ns: "error", reason: error.message })

          notification.error({ description, message: t("upload.uploadFailed", { ns: "error" }) })
        }

        dispatchChatUploadFileList({ id: file.name, type: "removeFile" })
      }
    })

    await Promise.all(pools)
  }
})
