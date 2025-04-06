import { Button, Space } from "antd"
import { createStyles } from "antd-style"
import { rgba } from "polished"
import { memo, useEffect, useState } from "react"
import { Flexbox } from "react-layout-kit"

import StopLoadingIcon from "@/components/StopLoading"
import { useSendMessage } from "@/features/ChatInput/useSend"
import { useChatStore } from '@/store/chat';
import { messageSelectors } from '@/store/chat/selectors';
import { useStoreSelector } from '@/hooks/useStoreSelector';
import { isMacOS } from "@/utils/platform"

import LocalFiles from "../../../../../../../../../features/ChatInput/Desktop/FilePreview"
import SaveTopic from "../../../../../../../../../features/ChatInput/Topic"
import SendMore from "./SendMore"
import ShortcutHint from "./ShortcutHint"
import chat from "@/locales/default/chat"

const useStyles = createStyles(({ css, prefixCls, token }) => {
    return {
        arrow: css`
            &.${prefixCls}-btn.${prefixCls}-btn-icon-only {
                width: 28px;
            }
        `,
        loadingButton: css`
            display: flex;
            align-items: center;
        `,
        overrideAntdIcon: css`
            .${prefixCls}-btn.${prefixCls}-btn-icon-only {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .${prefixCls}-btn.${prefixCls}-dropdown-trigger {
                &::before {
                    background-color: ${rgba(token.colorBgLayout, 0.1)} !important;
                }
            }
        `
    }
})
// // 静态变量定义
// const staticIsAIGenerating = false; // 模拟 AI 是否正在生成的状态，true 表示生成中
// const staticStopGenerateMessage = () => {
//     console.log('Stop generation triggered (static mock)');
//     // 这里可以添加模拟停止逻辑
// };
const Footer = memo(({ onExpandChange, expand }) => {
    // const { t } = useTranslation('chat');

    const { styles } = useStyles()

    // 使用useStoreSelector替代直接使用useChatStore
    const [isAIGenerating, stopGenerateMessage] = useChatStore((s) => [
        messageSelectors.isAIGenerating(s),
        s.stopGenerateMessage,
    ]);
    
    // // 替换原有的状态获取
    // const [isAIGenerating, stopGenerateMessage] = [
    //     staticIsAIGenerating,  // 使用静态变量代替 messageSelectors.isAIGenerating
    //     staticStopGenerateMessage  // 使用静态方法代替 store 的 stopGenerateMessage
    // ];

    const { send: sendMessage, canSend } = useSendMessage()

    const [isMac, setIsMac] = useState()


    useEffect(() => {
        setIsMac(isMacOS())
    }, [setIsMac])

    return (
        <Flexbox
            align={"end"}
            className={styles.overrideAntdIcon}
            distribution={"space-between"}
            flex={"none"}
            gap={8}
            horizontal
            padding={"0 24px"}
        >
            <Flexbox
                align={"center"}
                gap={8}
                horizontal
                style={{ overflow: "hidden" }}
            >
                {expand && <LocalFiles />}
            </Flexbox>
            <Flexbox align={"center"} flex={"none"} gap={8} horizontal>
                <ShortcutHint />
                <SaveTopic />
                <Flexbox style={{ minWidth: 92 }}>
                    {isAIGenerating ? (
                        <Button
                            className={styles.loadingButton}
                            icon={<StopLoadingIcon />}
                            onClick={() => {
                                stopGenerateMessage();
                            }}
                        >
                            {chat.input.stop}
                        </Button>
                    ) : (
                        <Space.Compact>
                            <Button
                                disabled={!canSend}
                                onClick={() => {
                                    sendMessage();
                                    onExpandChange?.(false);
                                }}
                                type={"primary"}
                            >
                                {chat.input.send}
                            </Button>
                            <SendMore disabled={!canSend} isMac={isMac} />
                        </Space.Compact>
                    )}
                </Flexbox>
            </Flexbox>
        </Flexbox>
    )
})

Footer.displayName = "Footer"

export default Footer
