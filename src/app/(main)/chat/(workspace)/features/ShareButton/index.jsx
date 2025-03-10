"use client"
import { ActionIcon } from "@lobehub/ui"
import { Share2 } from "lucide-react"
import dynamic from "next/dynamic"
import {memo, useState} from "react"
import { useTranslation } from "react-i18next"

import {
    DESKTOP_HEADER_ICON_SIZE,
} from "@/const/layoutTokens"
// import { useChatStore } from "@/store/chat"
//
// import { useWorkspaceModal } from "../useWorkspaceModal"
//
// const ShareModal = dynamic(() => import("@/features/ShareModal"))
import common from "@/locales/default/common";
const ShareButton = memo(() => {
    // const [isModalOpen, setIsModalOpen] = useWorkspaceModal(open, setOpen)
    const [isModalOpen, setIsModalOpen] = useState(false)
    // const { t } = useTranslation("common")
    // const [shareLoading] = useChatStore(s => [s.shareLoading])

    return (
        <>
            <ActionIcon
                icon={Share2}
                // loading={shareLoading}
                // onClick={() => setIsModalOpen(true)}
                onClick={() => {
                    console.log('打开分享功能（待实现）')
                    setIsModalOpen(true)
                }}
                size={DESKTOP_HEADER_ICON_SIZE}
                title={common.share}
            />
            {/*<ShareModal onCancel={() => setIsModalOpen(false)} open={isModalOpen} />*/}
        </>
    )
})

export default ShareButton
