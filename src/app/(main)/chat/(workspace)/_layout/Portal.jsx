"use client"

import { DraggablePanel, DraggablePanelContainer } from "@lobehub/ui"
import { createStyles, useResponsive } from "antd-style"
import { rgba } from "polished"
import { memo } from "react"
import { Flexbox } from "react-layout-kit"

import {
    CHAT_PORTAL_MAX_WIDTH,
    CHAT_PORTAL_TOOL_UI_WIDTH,
    CHAT_PORTAL_WIDTH
} from "@/const/layoutTokens"
// import { useChatStore } from "@/store/chat"
// import {
//     chatPortalSelectors,
//     portalThreadSelectors
// } from "@/store/chat/selectors"

// 静态数据配置
const staticConfig = {
    showPortal: true,      // 始终显示右侧面板
    showPluginUI: false,   // 默认不显示工具UI
    showArtifactUI: true,  // 默认显示制品UI
    showThread: false      // 默认不显示线程
}

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
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
    `,
    panel: css`
        overflow: hidden;
        height: 100%;
        background: ${isDarkMode
                ? rgba(token.colorBgElevated, 0.8)
                : token.colorBgElevated};
    `,

    thread: css`
        background: ${token.colorBgLayout};
    `
}))

const PortalPanel = memo(({ children }) => {
    const { styles, cx } = useStyles()
    const { md = true } = useResponsive()

    // const [
    //     showInspector,
    //     showToolUI,
    //     showArtifactUI,
    //     showThread
    // ] = useChatStore(s => [
    //     chatPortalSelectors.showPortal(s),
    //     chatPortalSelectors.showPluginUI(s),
    //     chatPortalSelectors.showArtifactUI(s),
    //     portalThreadSelectors.showThread(s)
    // ])
    // 替换原状态获取逻辑
    const [
        showInspector,
        showToolUI,
        showArtifactUI,
        showThread
    ] = [
        staticConfig.showPortal,
        staticConfig.showPluginUI,
        staticConfig.showArtifactUI,
        staticConfig.showThread
    ]

    return (

            <DraggablePanel
                className={styles.drawer}
                classNames={{
                    content: styles.content
                }}
                expand
                hanlderStyle={{ display: "none" }}
                maxWidth={CHAT_PORTAL_MAX_WIDTH}
                // minWidth={
                //     showArtifactUI || showToolUI || showThread
                //         ? CHAT_PORTAL_TOOL_UI_WIDTH
                //         : CHAT_PORTAL_WIDTH
                // }
                minWidth={
                    staticConfig.showArtifactUI || staticConfig.showToolUI || staticConfig.showThread
                        ? CHAT_PORTAL_TOOL_UI_WIDTH
                        : CHAT_PORTAL_WIDTH
                }
                mode={md ? "fixed" : "float"}
                placement={"right"}
                showHandlerWhenUnexpand={false}
                showHandlerWideArea={false}
            >
                <DraggablePanelContainer
                    style={{
                        flex: "none",
                        height: "100%",
                        maxHeight: "100vh",
                        minWidth: CHAT_PORTAL_WIDTH
                    }}
                >
                    <Flexbox className={cx(styles.panel, showThread && styles.thread)}>
                        {children}
                    </Flexbox>
                </DraggablePanelContainer>
            </DraggablePanel>

    )
})

export default PortalPanel
