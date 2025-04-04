"use client"
import React, { memo, useCallback } from "react"

import { SkeletonList, VirtualizedList } from "@/features/Conversation"
import { useFetchMessages } from "@/hooks/useFetchMessages"
import { useChatStore } from "@/store/chat"
import { messageSelectors } from "@/store/chat/selectors"

import MainChatItem from "./ChatItem"
import Welcome from "./WelcomeChatItem"

const Content = memo(() => {
  const isCurrentChatLoaded = useChatStore(messageSelectors.isCurrentChatLoaded)
  useFetchMessages()
  const data = useChatStore(messageSelectors.mainDisplayChatIDs)
  console.log('data',data)
  const itemContent = useCallback(
      (index, id) => <MainChatItem id={id} index={index} />,
  )

  if (!isCurrentChatLoaded) return <SkeletonList/>

  if (data.length === 0) return <Welcome />
  return (
      <VirtualizedList
          dataSource={data}
          itemContent={itemContent}
      />
  )
})

Content.displayName = "ChatListRender"

export default Content
