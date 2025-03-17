import { createStyles } from "antd-style"
import { memo, useState } from "react"
import { Flexbox } from "react-layout-kit"

import { useChatStore } from "@/store/chat"
import { useGlobalStore } from "@/store/global"

import Content from "./Content"
import {globalWorkspaceSlice} from "@/store/global/actions/workspacePane";
import {chatThreadMessage} from "@/store/chat/slices/thread/action";

const useStyles = createStyles(({ css, token, isDarkMode }, index) => ({
    active: css`
        background: ${isDarkMode
                ? token.colorFillSecondary
                : token.colorFillTertiary};
        transition: background 200ms ${token.motionEaseOut};

        &:hover {
            background: ${token.colorFill};
        }
    `,
    container: css`
        margin-inline: 8px;

        &::after {
            content: "";

            position: absolute;
            inset-block: 50px ${index * 40 + 20}px;
            inset-inline-start: 26px;

            width: 18px;

            border-block-end: 2px solid ${token.colorBorderSecondary};
            border-inline-start: 2px solid ${token.colorBorderSecondary};
            border-end-start-radius: 8px;
        }

        &.thread-item {
            width: calc(100% - 16px);
        }
    `,
    split: css`
        border-block-end: 1px solid ${token.colorSplit};
    `,
    wrapper: css`
        cursor: pointer;

        width: calc(100% - 36px);
        margin-block: 2px;
        padding-block: 4px;
        padding-inline: 8px;

        border-radius: ${token.borderRadius}px;

        &:hover {
            background: ${token.colorFillSecondary};
        }
    `
}))

const ThreadItem = memo(({ title, id, index }) => {
    const { styles, cx } = useStyles(index)
    const toggleConfig = useGlobalStore(globalWorkspaceSlice,s => s.toggleMobileTopic)
    const [toggleThread, activeThreadId] = useChatStore(chatThreadMessage,s => [
        s.switchThread,
        s.activeThreadId
    ])
    const [isHover, setHovering] = useState(false)

    const active = id === activeThreadId
    return (
        <Flexbox className={cx(styles.container, "thread-item")} horizontal>
            <Flexbox height={36} width={36} />
            <Flexbox
                align={"center"}
                className={cx(styles.wrapper, active && styles.active)}
                distribution={"space-between"}
                flex={1}
                horizontal
                onClick={() => {
                    toggleThread(id)
                    toggleConfig(false)
                }}
                onMouseEnter={() => {
                    setHovering(true)
                }}
                onMouseLeave={() => {
                    setHovering(false)
                }}
            >
                {<Content active={active} id={id} showMore={isHover} title={title} />}
            </Flexbox>
        </Flexbox>
    )
})

export default ThreadItem
