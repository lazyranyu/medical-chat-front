import React, { memo } from "react"

import { useChatStore } from "@/store/chat"
import { messageSelectors } from "@/store/chat/selectors"

import InboxWelcome from "./InboxWelcome"
import WelcomeMessage from "./WelcomeMessage"

const WelcomeChatItem = memo(() => {
  const showInboxWelcome = useChatStore(messageSelectors.showInboxWelcome)

  if (showInboxWelcome) return <InboxWelcome />

  return <WelcomeMessage />
})

export default WelcomeChatItem
