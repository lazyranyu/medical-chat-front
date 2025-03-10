import { useCallback } from "react"

import { AssistantMessage } from "./Assistant"
import { DefaultBelowMessage, DefaultMessage } from "./Default"
import { UserBelowMessage, UserMarkdownRender, UserMessage } from "./User"

export const renderMessages = {
  assistant: AssistantMessage,
  default: DefaultMessage,
  function: DefaultMessage,
  user: UserMessage
}

export const renderBelowMessages = {
  default: DefaultBelowMessage,
  user: UserBelowMessage
}

export const markdownCustomRenders = {
  user: UserMarkdownRender
}

export const useAvatarsClick = role => {
  return useCallback(() => {
    // 不响应任何点击事件
    return;
  }, [role])
}
