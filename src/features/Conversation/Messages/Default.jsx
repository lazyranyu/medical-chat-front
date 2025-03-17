import { memo } from "react"

import BubblesLoading from "@/components/BubblesLoading"
import { LOADING_FLAT } from "@/const/message"
import { useChatStore } from "@/store/chat"
import { messageSelectors } from "@/store/chat/selectors"

export const DefaultMessage = memo(
    ({
         id,
         editableContent,
         content,
         isToolCallGenerating,
         addIdOnDOM = true
     }) => {
        const editing = useChatStore(messageSelectors.isMessageEditing(id))

        if (isToolCallGenerating) return

        if (content === LOADING_FLAT && !editing) return <BubblesLoading />

        return <div id={addIdOnDOM ? id : undefined}>{editableContent}</div>
    }
)

export const DefaultBelowMessage = memo(() => {
    return null
}) 