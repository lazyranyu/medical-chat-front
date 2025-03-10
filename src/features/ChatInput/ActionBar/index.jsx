import { ChatInputActionBar } from "@lobehub/ui"
import { memo } from "react"

import { actionMap } from "./config"

const RenderActionList = ({ dataSource }) => (
    <>
        {dataSource.map(key => {
            const Render = actionMap[key]
            return <Render key={key} />
        })}
    </>
)

const ActionBar = memo(
    ({
         padding = "0 16px",
         rightAreaStartRender,
         rightAreaEndRender,
         leftAreaStartRender,
         leftAreaEndRender,
         leftActions,
         rightActions
     }) => (
        <ChatInputActionBar
            leftAddons={
                <>
                    {leftAreaStartRender}
                    <RenderActionList dataSource={leftActions} />
                    {leftAreaEndRender}
                </>
            }
            padding={padding}
            rightAddons={
                <>
                    {rightAreaStartRender}
                    <RenderActionList dataSource={rightActions} />
                    {rightAreaEndRender}
                </>
            }
        />
    )
)

export default ActionBar
