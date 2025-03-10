import { ActionIconGroup } from "@lobehub/ui"
import { memo, useContext, useMemo } from "react"

import { useChatStore } from "@/store/chat"
import { threadSelectors } from "@/store/chat/slices/thread/selectors"

import { InPortalThreadContext } from "../components/ChatItem/InPortalThreadContext"
import { useChatListActionsBar } from "../hooks/useChatListActionsBar"
import { useCustomActions } from "./customAction"

export const UserActionsBar = memo(({ onActionClick, id }) => {
  const [isThreadMode, hasThread] = useChatStore(s => [
    !!s.activeThreadId,
    threadSelectors.hasThreadBySourceMsgId(id)(s)
  ])
  const {
    regenerate,
    edit,
    copy,
    divider,
    del,
    branching
  } = useChatListActionsBar({ hasThread })
  const { translate } = useCustomActions()

  const inPortalThread = useContext(InPortalThreadContext)
  const inThread = isThreadMode || inPortalThread

  const items = useMemo(
      () => [regenerate, edit, inThread ? null : branching].filter(Boolean),
      [inThread]
  )

  return (
      <ActionIconGroup
          dropdownMenu={[
            edit,
            copy,
            divider,
            translate,
            divider,
            regenerate,
            del
          ]}
          items={items}
          onActionClick={onActionClick}
          type="ghost"
      />
  )
})
