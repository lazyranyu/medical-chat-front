import { useEffect } from "react"

import { useChatStore } from "@/store/chat"
import { messageSelectors } from "@/store/chat/selectors"
// // 静态配置
// const staticCurrentChatKey = 'default-chat'; // 模拟当前会话标识符

export const useAutoFocus = inputRef => {
  const chatKey = useChatStore(messageSelectors.currentChatKey)
  // useEffect(() => {
  //   inputRef.current?.focus();
  //   console.log('自动聚焦触发（模拟）');
  // }, [staticCurrentChatKey]); // 保留依赖项结构

  useEffect(() => {
    inputRef.current?.focus()
  }, [chatKey])
}
