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
  // 获取国际化翻译函数
  const { t } = useTranslation("topic")

  // 获取当前主题模式（深色/浅色）
  const { isDarkMode } = useThemeMode()
  
  // 从聊天状态存储中获取话题初始化状态
  const topicsInit = useChatStore(state => state.topicsInit)
  
  // 获取当前话题数量
  // 使用数组解构是因为useChatStore可以返回多个状态值，但这里只需要第一个
  const [topicLength] = useChatStore(s => [
    topicSelectors.currentTopicLength(s)
  ])
  
  // 获取当前应该显示的话题列表
  // 使用isEqual作为比较函数，避免引用不同但内容相同的数组导致不必要的重新渲染
  const activeTopicList = useChatStore(state => topicSelectors.displayTopics(state), isEqual)

  // 从用户状态存储中获取引导提示的可见性
  const visible = useUserStore(s => s.preference.guide?.topic)
  
  // 获取更新引导状态的函数
  // 注意：这个函数来自useUserStore而不是useChatStore
  const updateGuideState = useUserStore(state => state.updateGuideState)
  
  // 获取用户偏好的话题显示模式（按时间或平铺模式）
  const topicDisplayMode = useUserStore(s => preferenceSelectors.topicDisplayMode(s))

  // 调用自定义Hook加载话题数据
  useFetchTopics()

  // // 如果话题尚未初始化或没有话题数据，显示加载骨架屏
  // if (!topicsInit || !activeTopicList) return <SkeletonList />
  
  return (
      <>
        {/* 当没有话题且引导提示可见时，显示空状态卡片 */}
        {topicLength === 0 && visible && (
            <Flexbox paddingInline={8}>
              <EmptyCard
                  alt={t("guide.desc")} // 图片替代文本
                  cover={imageUrl(
                      `empty_topic_${isDarkMode ? "dark" : "light"}.webp`
                  )} // 根据当前主题选择不同的图片
                  desc={t("guide.desc")} // 描述文本
                  height={120} // 卡片高度
                  imageProps={{
                    priority: true // 图片优先加载
                  }}
                  onVisibleChange={visible => {
                    // 当用户关闭引导卡片时，更新引导状态
                    updateGuideState({ topic: visible })
                  }}
                  style={{ flex: "none", marginBottom: 12 }} // 卡片样式
                  title={t("guide.title")} // 卡片标题
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
