import { useCallback, useEffect, useMemo, useState } from "react"

import { useChatStore } from "@/store/chat"
import { chatSelectors } from "@/store/chat/selectors"
import { fileChatSelectors, useFileStore } from "@/store/file"
import { useStoreSelector } from "@/hooks/useStoreSelector"

export const useSendMessage = () => {
  // 使用useStoreSelector代替直接使用useChatStore
  const messages = useStoreSelector(useChatStore, state => state.messages)
  const inputMessage = useStoreSelector(useChatStore, state => state.inputMessage)

  // 使用useStoreSelector获取状态
  const isUploadingFiles = useStoreSelector(useFileStore, fileChatSelectors.isUploadingFiles)
  const isSendButtonDisabledByMessage = useStoreSelector(useChatStore, chatSelectors.isSendButtonDisabledByMessage)
  const isAIGenerating = useStoreSelector(useChatStore, chatSelectors.isAIGenerating)

  // 使用本地状态跟踪发送按钮状态
  const [localCanSend, setLocalCanSend] = useState(true)

  // 添加 isAIGenerating 到 canSend 的判断中
  const canSend = !isUploadingFiles && !isSendButtonDisabledByMessage && !isAIGenerating

  // 当依赖项变化时更新本地状态
  useEffect(() => {
    console.log('useSendMessage 状态更新:', {
      isUploadingFiles,
      isSendButtonDisabledByMessage,
      isAIGenerating,
      canSend,
      inputMessage,
      messagesCount: messages.length
    })
    setLocalCanSend(canSend)
  }, [isUploadingFiles, isSendButtonDisabledByMessage, isAIGenerating, canSend, inputMessage, messages])

  const send = useCallback((params = {}) => {
    console.log('send 被调用，参数:', params)
    
    // 获取store实例
    const store = useChatStore.getState()
    
    // 检查是否可以发送
    if (store.isAIGenerating) {
      console.log('AI 正在生成，不发送消息')
      return
    }

    // 检查是否正在上传文件
    const isUploading = fileChatSelectors.isUploadingFiles(useFileStore.getState())
    if (isUploading) {
      console.log('正在上传文件，不发送消息')
      return
    }
    
    // 获取当前输入消息
    const currentMessage = params.message || store.inputMessage
    
    // 检查消息是否为空
    if (!currentMessage.trim()) {
      console.log('消息为空，不发送')
      return
    }

    console.log('准备发送消息:', currentMessage)
    
    // 直接调用store的sendMessage方法
    store.sendMessage({
      message: currentMessage,
      ...params
    })
    
    console.log('消息已发送')
    
    // 检查发送后的状态
    setTimeout(() => {
      const newState = useChatStore.getState()
      console.log('发送后的状态 (useSendMessage):', {
        messages: newState.messages,
        inputMessage: newState.inputMessage
      })
    }, 100)
  }, [])

  return useMemo(() => ({ canSend: localCanSend, send }), [localCanSend, send])
}
// // 静态配置项
// const staticIsAIGenerating = false; // 模拟 AI 生成状态
// const staticIsUploadingFiles = false; // 模拟文件上传状态
// const staticIsSendButtonDisabledByMessage = false; // 模拟发送按钮禁用状态
// const staticInputMessage = "模拟输入消息"; // 模拟用户输入内容
// const staticChatUploadFileList = []; // 模拟上传文件列表
//
// // 静态模拟方法
// const staticSendMessage = (params) => {
//   console.log('发送消息（模拟）:', params);
// };
//
// const staticUpdateInputMessage = (message) => {
//   console.log('更新输入框内容（模拟）:', message);
// };
//
// const staticClearChatUploadFileList = () => {
//   console.log('清空上传文件列表（模拟）');
// };
//
// export const useSendMessage = () => {
//   // 替换原有的状态获取和方法调用
//   const isAIGenerating = staticIsAIGenerating;
//   const isUploadingFiles = staticIsUploadingFiles;
//   const isSendButtonDisabledByMessage = staticIsSendButtonDisabledByMessage;
//
//   const canSend = !isUploadingFiles && !isSendButtonDisabledByMessage;
//
//   const send = useCallback((params = {}) => {
//     if (isAIGenerating) return;
//
//     const fileList = staticChatUploadFileList;
//
//     // 如果没有消息且没有文件，则不发送消息
//     if (!staticInputMessage && fileList.length === 0) return;
//
//     staticSendMessage({
//       files: fileList,
//       message: staticInputMessage,
//       ...params
//     });
//
//     staticUpdateInputMessage("");
//     staticClearChatUploadFileList();
//   }, []);
//
//   return useMemo(() => ({ canSend, send }), [canSend]);
// };