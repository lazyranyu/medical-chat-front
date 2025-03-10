"use client"
import React, { memo, useCallback } from "react"

import { SkeletonList, VirtualizedList } from "@/features/Conversation"
import { useFetchMessages } from "@/hooks/useFetchMessages"
import { useChatStore } from "@/store/chat"
import { chatSelectors } from "@/store/chat/selectors"

import MainChatItem from "./ChatItem"
import Welcome from "./WelcomeChatItem"

const Content = memo(() => {
  const isCurrentChatLoaded = useChatStore(chatSelectors.isCurrentChatLoaded)
  useFetchMessages()
  const data = useChatStore(chatSelectors.mainDisplayChatIDs)

  const itemContent = useCallback(
      (index, id) => <MainChatItem id={id} index={index} />,
  )

  if (!isCurrentChatLoaded) return <SkeletonList/>

  if (data.length === 0) return <Welcome />
console.log('isCurrentChatLoaded',isCurrentChatLoaded)
  console.log('data',data)
  return (
      <VirtualizedList
          dataSource={data}
          itemContent={itemContent}
      />
  )
})

Content.displayName = "ChatListRender"

export default Content
