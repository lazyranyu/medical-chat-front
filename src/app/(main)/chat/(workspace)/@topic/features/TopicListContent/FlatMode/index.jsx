"use client"
import isEqual from "fast-deep-equal"
import React, { memo, useCallback, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Virtuoso } from "react-virtuoso"

import { useChatStore } from "@/store/chat"
import { topicSelectors } from "@/store/chat/selectors"
import topic from "@/locales/default/topic";
import TopicItem from "../TopicItem"


const FlatMode = memo(() => {
    // const { t } = useTranslation("topic")
    const virtuosoRef = useRef(null)
    const [activeTopicId] = useChatStore(topicSelectors,s => [s.activeTopicId])
    const activeTopicList = useChatStore(topicSelectors.displayTopics, isEqual)

    const topics = useMemo(
        () => [
            {
                favorite: false,
                id: "default",
                title: topic.defaultTitle
            },
            ...(activeTopicList || [])
        ],
        [activeTopicList]
    )

    const itemContent = useCallback(
        (index, { id, favorite, title }) =>
            index === 0 ? (
                <TopicItem active={!activeTopicId} fav={favorite} title={title} />
            ) : (
                <TopicItem
                    active={activeTopicId === id}
                    fav={favorite}
                    id={id}
                    key={id}
                    title={title}
                />
            ),
        [activeTopicId]
    )

    const activeIndex = topics.findIndex(topic => topic.id === activeTopicId)

    return (
        <Virtuoso
            // components={{ ScrollSeekPlaceholder: Placeholder }}
            computeItemKey={(_, item) => item.id}
            data={topics}
            defaultItemHeight={44}
            initialTopMostItemIndex={Math.max(activeIndex, 0)}
            itemContent={itemContent}
            overscan={44 * 10}
            // scrollSeekConfiguration={{
            //   enter: (velocity) => Math.abs(velocity) > 350,
            //   exit: (velocity) => Math.abs(velocity) < 10,
            // }}
            ref={virtuosoRef}
        />
    )
})

FlatMode.displayName = "FlatMode"

export default FlatMode
