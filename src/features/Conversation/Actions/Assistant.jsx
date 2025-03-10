import { ActionIconGroup } from "@lobehub/ui"
import { memo, useContext, useMemo } from "react"

import { useChatStore } from "@/store/chat"
import { threadSelectors } from "@/store/chat/selectors"

import { InPortalThreadContext } from "../components/ChatItem/InPortalThreadContext"
import { useChatListActionsBar } from "../hooks/useChatListActionsBar"
import { ErrorActionsBar } from "./Error"
import { useCustomActions } from "./customAction"

export const AssistantActionsBar = memo(
    ({ onActionClick, error, tools, id }) => {
        const [isThreadMode, hasThread] = useChatStore(s => [
            !!s.activeThreadId,
            threadSelectors.hasThreadBySourceMsgId(id)(s)
        ])

        const {
            regenerate,
            edit,
            delAndRegenerate,
            copy,
            divider,
            del,
            branching
        } = useChatListActionsBar({ hasThread })

        const { translate } = useCustomActions()
        const hasTools = !!tools

        const inPortalThread = useContext(InPortalThreadContext)
        const inThread = isThreadMode || inPortalThread

        const items = useMemo(() => {
            if (hasTools) return [delAndRegenerate, copy]

            return [edit, copy, inThread ? null : branching].filter(Boolean)
        }, [inThread, hasTools])

        if (error) return <ErrorActionsBar onActionClick={onActionClick} />

        return (
            <ActionIconGroup
                dropdownMenu={[
                    edit,
                    copy,
                    divider,
                    translate,
                    divider,
                    regenerate,
                    delAndRegenerate,
                    del
                ]}
                items={items}
                onActionClick={onActionClick}
                type="ghost"
            />
        )
    }
)
