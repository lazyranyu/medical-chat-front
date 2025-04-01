import { ActionIcon } from "@lobehub/ui"
import { Popconfirm } from "antd"
import { Eraser } from "lucide-react"
import { memo, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { shallow } from "zustand/shallow"

import { useChatStore } from "@/store/chat"
import { useFileStore } from "@/store/file"
import setting from "@/locales/default/setting";
import chat from "@/locales/default/chat";
// 静态模拟方法
// const staticClearMessage = async () => {
//     console.log('Messages cleared (static mock)');
//     // 这里可以添加模拟消息清除逻辑
// };
//
// const staticClearImageList = () => {
//     console.log('Image list cleared (static mock)');
//     // 这里可以添加模拟图片清除逻辑
// };
const Clear = memo(() => {
    const { t } = useTranslation("setting")

    const [clearMessage] = useChatStore((s) => [s.clearMessage]);
    const [clearImageList] = useFileStore((s) => [s.clearChatUploadFileList]);
    
    const [confirmOpened, updateConfirmOpened] = useState(false)

    const resetConversation = useCallback(async () => {
        await clearMessage()
        clearImageList()
    }, [clearMessage, clearImageList])

    const actionTitle = confirmOpened
        ? void 0
        : chat.clearCurrentMessages

    const popconfirmPlacement = "topRight"

    return (
        <Popconfirm
            arrow={false}
            okButtonProps={{ danger: true, type: "primary" }}
            onConfirm={resetConversation}
            onOpenChange={updateConfirmOpened}
            open={confirmOpened}
            placement={popconfirmPlacement}
            title={
                <div
                    style={{
                        marginBottom: "8px",
                        whiteSpace: "pre-line",
                        wordBreak: "break-word"
                    }}
                >
                    {chat.confirmClearCurrentMessages}
                </div>
            }
        >
            <ActionIcon
                icon={Eraser}
                styles={{ root: { maxWidth: "none" } }}
                placement={"bottom"}
                title={actionTitle}
            />
        </Popconfirm>
    )
})

export default Clear
