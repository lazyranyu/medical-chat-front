"use client"
import { ActionIcon, Icon } from "@lobehub/ui"
import { App, Dropdown } from "antd"
import { LucideCheck, MoreHorizontal, Search, Trash } from "lucide-react"
import { memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"

import SidebarHeader from "@/components/SidebarHeader"
import { useChatStore } from "@/store/chat"
import { topicSelectors } from "@/store/chat/selectors"
import { useUserStore } from "@/store/user"
import { preferenceSelectors } from "@/store/user/selectors"
import { TopicDisplayMode } from "@/types/topic"
import topic from "@/locales/default/topic";

import TopicSearchBar from "./TopicSearchBar"


const Header = memo(() => {
    const { t } = useTranslation("topic")
    
    // 从 useChatStore 获取数据和方法
    const topicLength = useChatStore(state => topicSelectors.currentTopicLength(state))
    const removeUnstarredTopic = useChatStore(state => state.removeUnstarredTopic)
    const removeAllTopic = useChatStore(state => state.removeSessionTopics)
    
    // 从 useUserStore 获取数据和方法
    const topicDisplayMode = useUserStore(state => preferenceSelectors.topicDisplayMode(state))
    const updatePreference = useUserStore(state => state.updatePreference)
    
    const [showSearch, setShowSearch] = useState(false)
    const { modal } = App.useApp()

    const items = useMemo(
        () => [
            ...Object.values(TopicDisplayMode).map(mode => ({
                icon: topicDisplayMode === mode ? <Icon icon={LucideCheck} /> : <div />,
                key: mode,
                label: topic.groupMode[mode],
                onClick: () => {
                    updatePreference({ topicDisplayMode: mode })
                }
            })),
            {
                type: "divider"
            },
            {
                icon: <Icon icon={Trash} />,
                key: "deleteUnstarred",
                label: topic.actions.removeUnstarred,
                onClick: () => {
                    modal.confirm({
                        centered: true,
                        okButtonProps: { danger: true },
                        onOk: removeUnstarredTopic,
                        title: topic.actions.confirmRemoveUnstarred
                    })
                }
            },
            {
                danger: true,
                icon: <Icon icon={Trash} />,
                key: "deleteAll",
                label: topic.actions.removeAll,
                onClick: () => {
                    modal.confirm({
                        centered: true,
                        okButtonProps: { danger: true },
                        onOk: removeAllTopic,
                        title: topic.actions.confirmRemoveAll
                    })
                }
            }
        ],
        [topicDisplayMode, t, modal, removeUnstarredTopic, removeAllTopic, updatePreference]
    )

    return showSearch ? (
        <Flexbox padding={"12px 16px 4px"}>
            <TopicSearchBar onClear={() => setShowSearch(false)} />
        </Flexbox>
    ) : (
        <SidebarHeader
            actions={
                <>
                    <ActionIcon
                        icon={Search}
                        onClick={() => setShowSearch(true)}
                        size={"small"}
                    />
                    <Dropdown
                        arrow={false}
                        menu={{
                            items: items,
                            onClick: ({ domEvent }) => {
                                domEvent.stopPropagation()
                            }
                        }}
                        trigger={["click"]}
                    >
                        <ActionIcon icon={MoreHorizontal} size={"small"} />
                    </Dropdown>
                </>
            }
            title={`${topic.title} ${topicLength > 1 ? topicLength + 1 : ""}`}
        />
    )
})

export default Header
