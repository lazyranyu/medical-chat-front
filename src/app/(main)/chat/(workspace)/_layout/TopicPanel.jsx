"use client"

import { DraggablePanel, DraggablePanelContainer } from "@lobehub/ui"
import { createStyles, useResponsive } from "antd-style"
import isEqual from "fast-deep-equal"
import { memo, useEffect, useState } from "react"

import { CHAT_SIDEBAR_WIDTH } from "@/const/layoutTokens"
// import { useChatStore } from "@/store/chat"
// import { chatPortalSelectors } from "@/store/chat/slices/portal/selectors"
import { useGlobalStore } from "@/store/global"
import {systemStatusSelectors} from "@/store";
import {globalWorkspaceSlice} from "@/store/global/actions/workspacePane";
// import {state} from "@auth/core/lib/actions/callback/oauth/checks";
// import { systemStatusSelectors } from "@/store/global/selectors"
// 添加静态配置
// const staticConfig = {
//     showTopic: true,     // 始终显示话题侧边栏
//     showPortal: false,   // 确保不显示门户面板
//     isMobile: false      // 桌面端布局
// }
const useStyles = createStyles(({ css, token }) => ({
    content: css`
        display: flex;
        flex-direction: column;
        height: 100% !important;
    `,
    drawer: css`
        z-index: 10;
        background: ${token.colorBgLayout};
    `,
    header: css`
        border-block-end: 1px solid ${token.colorBorder};
    `
}))

const TopicPanel = memo(({ children }) => {
    const { styles } = useStyles()
    const { md = true, lg = true } = useResponsive()

    const [showTopic] = useGlobalStore(s => [
        systemStatusSelectors.showChatSideBar(s),
    ])
    const toggleConfig = useGlobalStore(s => s.toggleChatSideBar)
    const [cacheExpand, setCacheExpand] = useState(Boolean(showTopic))

    const handleExpand = expand => {
        if (isEqual(expand, Boolean(showTopic))) return
        toggleConfig(expand)
        setCacheExpand(expand)
    }

    useEffect(() => {
        if (lg && cacheExpand) toggleConfig(true)
        if (!lg) toggleConfig(false)
    }, [lg, cacheExpand])

    return (
        (
            <DraggablePanel
                className={styles.drawer}
                classNames={{
                    content: styles.content
                }}
                expand={showTopic}
                onExpandChange={handleExpand}
                minWidth={CHAT_SIDEBAR_WIDTH}
                mode={md ? 'fixed' : 'float'}
                placement={"right"}
                showHandlerWideArea={false}
            >
                <DraggablePanelContainer
                    style={{
                        flex: "none",
                        height: "100%",
                        maxHeight: "100vh",
                        minWidth: CHAT_SIDEBAR_WIDTH
                    }}
                >
                    {children}
                </DraggablePanelContainer>
            </DraggablePanel>
        )
    )
})

export default TopicPanel
