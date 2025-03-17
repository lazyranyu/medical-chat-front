// import { useCallback, useEffect, useMemo, useState } from "react"
//
// import { useChatStore } from "@/store/chat"
// import { messageSelectors } from "@/store/chat/selectors"
// import { fileChatSelectors, useFileStore, fileStableSelectors } from "@/store/file"
// import { useStoreSelector } from "@/hooks/useStoreSelector"
//
// export const useSendMessage = () => {
//   // 使用useStoreSelector代替直接使用useChatStore
//   const messages = useStoreSelector(useChatStore, state => state.messages)
//   const inputMessage = useStoreSelector(useChatStore, state => state.inputMessage)
//
//   // 使用useStoreSelector获取状态
//   const isUploadingFiles = useStoreSelector(useFileStore, fileChatSelectors.isUploadingFiles)
//   const isSendButtonDisabledByMessage = useStoreSelector(useChatStore, messageSelectors.isSendButtonDisabledByMessage)
//   const isAIGenerating = useStoreSelector(useChatStore, messageSelectors.isAIGenerating)
//
//   // 使用本地状态跟踪发送按钮状态
//   const [localCanSend, setLocalCanSend] = useState(true)
//
//   // 添加 isAIGenerating 到 canSend 的判断中
//   const canSend = !isUploadingFiles && !isSendButtonDisabledByMessage && !isAIGenerating
//
//   // 当依赖项变化时更新本地状态
//   useEffect(() => {
//     console.log('useSendMessage 状态更新:', {
//       isUploadingFiles,
//       isSendButtonDisabledByMessage,
//       isAIGenerating,
//       canSend,
//       inputMessage,
//       messagesCount: messages.length
//     })
//     setLocalCanSend(canSend)
//   }, [isUploadingFiles, isSendButtonDisabledByMessage, isAIGenerating, canSend, inputMessage, messages])
//
//   const send = useCallback((params = {}) => {
//     console.log('send 被调用，参数:', params)
//
//     // 获取store实例
//     const store = useChatStore.getState()
//
//     // 检查是否可以发送
//     if (store.isAIGenerating) {
//       console.log('AI 正在生成，不发送消息')
//       return
//     }
//
//     // 检查是否正在上传文件
//     const isUploading = fileChatSelectors.isUploadingFiles(useFileStore.getState())
//     if (isUploading) {
//       console.log('正在上传文件，不发送消息')
//       return
//     }
//
//     // 获取当前输入消息
//     const currentMessage = params.message || store.inputMessage
//
//     // 获取已上传的文件列表
//     const fileStore = useFileStore.getState()
//     const uploadedFiles = fileStore.chatUploadFileList || []
//
//     console.log('已上传的文件列表:', uploadedFiles)
//
//     // 检查消息是否为空且没有文件
//     if (!currentMessage.trim() && uploadedFiles.length === 0) {
//       console.log('消息为空且没有文件，不发送')
//       return
//     }
//
//     console.log('准备发送消息:', currentMessage, '文件数量:', uploadedFiles.length)
//
//     // 直接调用store的sendMessage方法，并传入文件列表
//     store.sendMessage({
//       message: currentMessage,
//       files: uploadedFiles,
//       ...params
//     })
//
//     // 清空文件列表
//     if (uploadedFiles.length > 0) {
//       const clearChatUploadFileList = fileStableSelectors.getClearChatUploadFileList(fileStore)
//       clearChatUploadFileList()
//       console.log('已清空文件列表')
//     }
//
//     console.log('消息已发送')
//
//     // 检查发送后的状态
//     setTimeout(() => {
//       const newState = useChatStore.getState()
//       console.log('发送后的状态 (useSendMessage):', {
//         messages: newState.messages,
//         inputMessage: newState.inputMessage
//       })
//     }, 100)
//   }, [])
//
//   return useMemo(() => ({ canSend: localCanSend, send }), [localCanSend, send])
// }
// // // 静态配置项
// // const staticIsAIGenerating = false; // 模拟 AI 生成状态
// // const staticIsUploadingFiles = false; // 模拟文件上传状态
// // const staticIsSendButtonDisabledByMessage = false; // 模拟发送按钮禁用状态
// // const staticInputMessage = "模拟输入消息"; // 模拟用户输入内容
// // const staticChatUploadFileList = []; // 模拟上传文件列表
// //
// // // 静态模拟方法
// // const staticSendMessage = (params) => {
// //   console.log('发送消息（模拟）:', params);
// // };
// //
// // const staticUpdateInputMessage = (message) => {
// //   console.log('更新输入框内容（模拟）:', message);
// // };
// //
// // const staticClearChatUploadFileList = () => {
// //   console.log('清空上传文件列表（模拟）');
// // };
// //
// // export const useSendMessage = () => {
// //   // 替换原有的状态获取和方法调用
// //   const isAIGenerating = staticIsAIGenerating;
// //   const isUploadingFiles = staticIsUploadingFiles;
// //   const isSendButtonDisabledByMessage = staticIsSendButtonDisabledByMessage;
// //
// //   const canSend = !isUploadingFiles && !isSendButtonDisabledByMessage;
// //
// //   const send = useCallback((params = {}) => {
// //     if (isAIGenerating) return;
// //
// //     const fileList = staticChatUploadFileList;
// //
// //     // 如果没有消息且没有文件，则不发送消息
// //     if (!staticInputMessage && fileList.length === 0) return;
// //
// //     staticSendMessage({
// //       files: fileList,
// //       message: staticInputMessage,
// //       ...params
// //     });
// //
// //     staticUpdateInputMessage("");
// //     staticClearChatUploadFileList();
// //   }, []);
// //
// //   return useMemo(() => ({ canSend, send }), [canSend]);
// // };



import { useCallback, useMemo } from "react"

import { useChatStore } from "@/store/chat"
import { messageSelectors } from "@/store/chat/selectors"
import { fileChatSelectors, useFileStore } from "@/store/file"

export const useSendMessage = () => {
  const [sendMessage, updateInputMessage] = useChatStore(s => [
    s.sendMessage,
    s.updateInputMessage
  ])

  const clearChatUploadFileList = useFileStore(s => s.clearChatUploadFileList)

  const isUploadingFiles = useFileStore(fileChatSelectors.isUploadingFiles)
  const isSendButtonDisabledByMessage = useChatStore(
      messageSelectors.isSendButtonDisabledByMessage
  )

  const canSend = !isUploadingFiles && !isSendButtonDisabledByMessage

  const send = useCallback((params = {}) => {
    const store = useChatStore.getState()
    if (messageSelectors.isAIGenerating(store)) return

    // if uploading file or send button is disabled by message, then we should not send the message
    const isUploadingFiles = fileChatSelectors.isUploadingFiles(
        useFileStore.getState()
    )
    const isSendButtonDisabledByMessage = messageSelectors.isSendButtonDisabledByMessage(
        useChatStore.getState()
    )

    const canSend = !isUploadingFiles && !isSendButtonDisabledByMessage
    if (!canSend) return

    const fileList = fileChatSelectors.chatUploadFileList(
        useFileStore.getState()
    )
    // if there is no message and no image, then we should not send the message
    if (!store.inputMessage && fileList.length === 0) return

    sendMessage({
      files: fileList,
      message: store.inputMessage,
      ...params
    })

    updateInputMessage("")
    clearChatUploadFileList()

    // const hasSystemRole = agentSelectors.hasSystemRole(useAgentStore.getState());
    // const agentSetting = useAgentStore.getState().agentSettingInstance;

    // // if there is a system role, then we need to use agent setting instance to autocomplete agent meta
    // if (hasSystemRole && !!agentSetting) {
    //   agentSetting.autocompleteAllMeta();
    // }
  }, [])

  return useMemo(() => ({ canSend, send }), [canSend])
}
