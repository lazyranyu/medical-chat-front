import { ActionIconGroup } from "@lobehub/ui"
import { memo } from "react"

import { useChatListActionsBar } from "../hooks/useChatListActionsBar"

export const DefaultActionsBar = memo(({ onActionClick }) => {
  const { del } = useChatListActionsBar()

  return (
      <ActionIconGroup
          dropdownMenu={[del]}
          items={[]}
          onActionClick={onActionClick}
          type="ghost"
      />
  )
})
