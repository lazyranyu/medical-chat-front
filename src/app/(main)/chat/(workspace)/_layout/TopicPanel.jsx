"use client"

import { DraggablePanel, DraggablePanelContainer } from "@lobehub/ui"
import { createStyles, useResponsive } from "antd-style"
import isEqual from "fast-deep-equal"
import { memo, useEffect, useState } from "react"

import { CHAT_SIDEBAR_WIDTH } from "@/const/layoutTokens"
// import { useChatStore } from "@/store/chat"
// import { chatPortalSelectors } from "@/store/chat/slices/portal/selectors"
// import { useGlobalStore } from "@/store/global"
// import { systemStatusSelectors } from "@/store/global/selectors"
// 添加静态配置
const staticConfig = {
    showTopic: true,     // 始终显示话题侧边栏
    showPortal: false,   // 确保不显示门户面板
    isMobile: false      // 桌面端布局
}
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
    // const { md = true, lg = true } = useResponsive()
    // const [showTopic, toggleConfig] = useGlobalStore(s => [
    //     systemStatusSelectors.showChatSideBar(s),
    //     s.toggleChatSideBar
    // ])
    // const showPortal = useChatStore(chatPortalSelectors.showPortal)
    //
    // const [cacheExpand, setCacheExpand] = useState(Boolean(showTopic))
    // 固定响应式模式为桌面端
    const { md = true, lg = true } = { md: true, lg: true };

    // 替换状态获取逻辑
    const [showTopic, toggleConfig] = [
        staticConfig.showTopic,
        () => {} // 空函数替代状态切换
    ];
    const showPortal = staticConfig.showPortal;

    // 简化展开状态管理
    const [cacheExpand] = useState(true);
    const handleExpand = expand => {
        if (isEqual(expand, Boolean(showTopic))) return
        toggleConfig(expand)
        setCacheExpand(expand)
    }

    // useEffect(() => {
    //     if (lg && cacheExpand) toggleConfig(true)
    //     if (!lg) toggleConfig(false)
    // }, [lg, cacheExpand])

    return (
        !showPortal && (
            <DraggablePanel
                className={styles.drawer}
                classNames={{
                    content: styles.content
                }}
                // expand={showTopic}
                // minWidth={CHAT_SIDEBAR_WIDTH}
                // mode={md ? "fixed" : "float"}
                // onExpandChange={handleExpand}
                expand={true} // 固定为展开状态
                minWidth={CHAT_SIDEBAR_WIDTH}
                mode="fixed"  // 固定为桌面模式
                onExpandChange={() => {}} // 禁用拖拽回调
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
