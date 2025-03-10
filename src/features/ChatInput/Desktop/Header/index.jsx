import { ActionIcon } from "@lobehub/ui"
import { Maximize2, Minimize2 } from "lucide-react"
import { memo } from "react"

import ActionBar from "@/features/ChatInput/ActionBar"

const Header = memo(({ expand, setExpand, leftActions, rightActions }) => (
    <ActionBar
        leftActions={leftActions}
        rightActions={rightActions}
        rightAreaEndRender={
            <ActionIcon
                icon={expand ? Minimize2 : Maximize2}
                onClick={() => {
                    setExpand(!expand)
                }}
            />
        }
    />
))

export default Header
