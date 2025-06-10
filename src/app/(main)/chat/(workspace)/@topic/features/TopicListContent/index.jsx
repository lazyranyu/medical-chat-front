"use client"

import { EmptyCard } from "@lobehub/ui"
import { useThemeMode } from "antd-style"
import isEqual from "fast-deep-equal"
import React, { memo } from "react"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"

import { imageUrl } from "@/const/url"
import { useFetchTopics } from "@/hooks/useFetchTopics"
import { useChatStore } from "@/store/chat"
import { topicSelectors } from "@/store/chat/selectors"
import { useUserStore } from "@/store/user"
import { preferenceSelectors } from "@/store/user/selectors"
import { TopicDisplayMode } from "@/types/topic"

import { SkeletonList } from "../SkeletonList"
import ByTimeMode from "./ByTimeMode"
import FlatMode from "./FlatMode"
import topic from "@/locales/default/topic";

/**
 * 话题列表内容组件
 * 
 * 该组件负责渲染聊天话题列表的内容部分，包括：
 * 1. 当没有话题时显示的引导卡片
 * 2. 根据用户偏好设置选择不同的话题显示模式（按时间或平铺模式）
 * 
 * 组件使用了React.memo进行性能优化，避免不必要的重新渲染
 */
const TopicListContent = memo(() => {
  // // 获取国际化翻译函数
  // const { t } = useTranslation("topic")

  const { isDarkMode } = useThemeMode()
  const [topicsInit, topicLength] = useChatStore(s => [
    s.topicsInit,
    topicSelectors.currentTopicLength(s)
  ])
  const activeTopicList = useChatStore(topicSelectors.displayTopics, isEqual)

  const [visible, updateGuideState, topicDisplayMode] = useUserStore(s => [
    s.preference.guide?.topic,
    s.updateGuideState,
    preferenceSelectors.topicDisplayMode(s)
  ])
  console.log("visible", visible)

  useFetchTopics()
  console.log("!topicsInit", !topicsInit)
  console.log("activeTopicList", activeTopicList)
// first time loading or has no data
  if (!topicsInit || !activeTopicList) return <SkeletonList />

  return (
      <>
        {/* 当没有话题且引导提示可见时，显示空状态卡片 */}
        {topicLength === 0 && visible && (
            <Flexbox paddingInline={8}>
              <EmptyCard
                  alt={topic.guide.desc} // 图片替代文本
                  cover={imageUrl(
                      `empty_topic_light.webp`
                  )} // 根据当前主题选择不同的图片
                  desc={topic.guide.desc} // 描述文本
                  height={120} // 卡片高度
                  imageProps={{
                    priority: true // 图片优先加载
                  }}
                  onVisibleChange={visible => {
                    // 当用户关闭引导卡片时，更新引导状态
                    updateGuideState({ topic: visible })
                  }}
                  style={{ flex: "none", marginBottom: 12 }} // 卡片样式
                  title={topic.guide.title} // 卡片标题
                  visible={visible} // 控制卡片可见性
                  width={200} // 卡片宽度
              />
            </Flexbox>
        )}
        
        {/* 根据用户偏好设置选择不同的话题显示模式 */}
        {topicDisplayMode === TopicDisplayMode.ByTime ? (
            // 按时间分组显示话题
            <ByTimeMode />
        ) : (
            // 平铺显示所有话题
            <FlatMode />
        )}
      </>
  )
})

// 设置组件显示名称，便于React开发工具中识别
TopicListContent.displayName = "TopicListContent"

export default TopicListContent
