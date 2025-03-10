import { ActionIcon } from "@lobehub/ui"
import { Compass, FolderClosed, MessageSquare } from "lucide-react"
import Link from "next/link"
import { memo } from "react"
import { useTranslation } from "react-i18next"

import common from "@/locales/default/common";
// import { useGlobalStore } from "@/store/global"
// import { SidebarTabKey } from "@/store/global/initialState"
// import {
//     featureFlagsSelectors,
//     useServerConfigStore
// } from "@/store/serverConfig"
// import { useSessionStore } from "@/store/session"

const TopActions = memo(({ tab }) => {
    // const switchBackToChat = useGlobalStore(s => s.switchBackToChat)
    // const { showMarket, enableKnowledgeBase } = useServerConfigStore(
    //     featureFlagsSelectors
    // )

    return (
        <>
            <Link
                aria-label={common.tab.chat}
                //todo
                 href={"/chat"}
                // onClick={e => {
                //     e.preventDefault()
                //     switchBackToChat(useSessionStore.getState().activeId)
                // }}
            >
                <ActionIcon
                    // active={tab === SidebarTabKey.Chat}
                    icon={MessageSquare}
                    placement={"right"}
                    size="large"
                    title={common.tab.chat}
                />
            </Link>
            { (
                //todo  href={"/files"}
                <Link aria-label={common.tab.files} href={"/welcome"}>
                    <ActionIcon
                        // active={tab === SidebarTabKey.Files}
                        icon={FolderClosed}
                        placement={"right"}
                        size="large"
                        title={common.tab.files}
                    />
                </Link>
            )}
            { (
                <Link aria-label={common.tab.discover} href={"/discover"}>
                    <ActionIcon
                        // active={tab === SidebarTabKey.Discover}
                        icon={Compass}
                        placement={"right"}
                        size="large"
                        title={common.tab.discover}
                    />
                </Link>
            )}
        </>
    )
})

export default TopActions
