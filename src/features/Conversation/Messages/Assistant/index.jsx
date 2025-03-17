import { Skeleton } from "antd"
import { Suspense, memo, useContext } from "react"
import { Flexbox } from "react-layout-kit"

import { LOADING_FLAT } from "@/const/message"
import { InPortalThreadContext } from "@/features/Conversation/components/ChatItem/InPortalThreadContext"
import { useChatStore } from "@/store/chat"
import { messageSelectors } from "@/store/chat/selectors"

import { DefaultMessage } from "../Default"
import FileChunks from "./FileChunks"

export const AssistantMessage = memo(
    ({ id, tools, content, chunksList, ...props }) => {
      const editing = useChatStore(messageSelectors.isMessageEditing(id))
      const generating = useChatStore(messageSelectors.isMessageGenerating(id))

      const inThread = useContext(InPortalThreadContext)
      const isToolCallGenerating =
          generating && (content === LOADING_FLAT || !content) && !!tools

      return editing ? (
          <DefaultMessage
              content={content}
              id={id}
              isToolCallGenerating={isToolCallGenerating}
              {...props}
          />
      ) : (
          <Flexbox gap={8} id={id}>
            {!!chunksList && chunksList.length > 0 && (
                <FileChunks data={chunksList} />
            )}
            {content && (
                <DefaultMessage
                    addIdOnDOM={false}
                    content={content}
                    id={id}
                    isToolCallGenerating={isToolCallGenerating}
                    {...props}
                />
            )}
          </Flexbox>
      )
    }
) 