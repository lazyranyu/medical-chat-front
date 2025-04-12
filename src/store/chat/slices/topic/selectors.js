/**
 * 聊天话题切片 - 选择器
 * 
 * 定义了用于从状态中提取话题相关数据的选择器函数
 * 选择器可以优化性能并使状态访问更加一致
 */

import { t } from "i18next" // 国际化工具，用于翻译

import { groupTopicsByTime } from "@/utils/client/topic" // 按时间分组话题的工具函数

/**
 * 获取当前活动会话的所有话题
 * @param {Object} s - 状态对象
 * @returns {Array} 当前会话的话题列表，始终返回数组
 */
const currentTopics = s => {
  const topics = s.topicMaps[s.activeId]
  // 确保返回的值是数组
  return Array.isArray(topics) ? topics : []
}

/**
 * 获取当前选中的活动话题
 * @param {Object} s - 状态对象
 * @returns {Object|undefined} 当前选中的话题对象
 */
const currentActiveTopic = s => {
  return currentTopics(s)?.find(topic => topic.id === s.activeTopicId)
}

/**
 * 获取搜索结果中的话题
 * @param {Object} s - 状态对象
 * @returns {Array} 搜索结果话题列表
 */
const searchTopics = s => s.searchTopics

/**
 * 获取应该显示的话题列表
 * 如果正在搜索，返回搜索结果；否则返回当前会话的话题
 * @param {Object} s - 状态对象
 * @returns {Array|undefined} 应显示的话题列表
 */
const displayTopics = s =>
    s.isSearchingTopic ? searchTopics(s) : currentTopics(s)

/**
 * 获取当前会话中已收藏的话题
 * @param {Object} s - 状态对象
 * @returns {Array} 已收藏的话题列表
 */
const currentFavTopics = s => {
  const topics = currentTopics(s)
  return Array.isArray(topics) ? topics.filter(t => t.favorite) : []
}

/**
 * 获取当前会话中未收藏的话题
 * @param {Object} s - 状态对象
 * @returns {Array} 未收藏的话题列表
 */
const currentUnFavTopics = s => {
  const topics = currentTopics(s)
  return Array.isArray(topics) ? topics.filter(t => !t.favorite) : []
}

/**
 * 获取当前会话话题的数量
 * @param {Object} s - 状态对象
 * @returns {number} 话题数量
 */
const currentTopicLength = s => currentTopics(s)?.length || 0

/**
 * 根据ID获取话题
 * @param {string} id - 话题ID
 * @returns {Function} 返回一个接收状态的函数，该函数返回指定ID的话题
 */
const getTopicById = id => s => currentTopics(s)?.find(topic => topic.id === id)

/**
 * 获取当前活动话题的摘要信息
 * @param {Object} s - 状态对象
 * @returns {Object|undefined} 包含内容摘要、模型和提供者信息的对象
 */
const currentActiveTopicSummary = s => {
  const activeTopic = currentActiveTopic(s)
  if (!activeTopic) return undefined

  return {
    content: activeTopic.historySummary || "", // 历史摘要内容
    model: activeTopic.metadata?.model || "", // 使用的模型
    provider: activeTopic.metadata?.provider || "" // 服务提供者
  }
}

/**
 * 检查是否正在创建话题
 * @param {Object} s - 状态对象
 * @returns {boolean} 是否正在创建话题
 */
const isCreatingTopic = s => s.creatingTopic

/**
 * 获取按分组组织的话题列表
 * 收藏的话题单独分组，其他话题按时间分组
 * @param {Object} s - 状态对象
 * @returns {Array} 分组后的话题列表
 */
const groupedTopicsSelector = s => {
  const topics = displayTopics(s)

  if (!topics) return []
  const favTopics = currentFavTopics(s)
  const unfavTopics = currentUnFavTopics(s)

  // 如果有收藏的话题，将其单独分为一组
  return favTopics.length > 0
      ? [
        {
          children: favTopics,
          id: "favorite",
          title: t("favorite", { ns: "topic" }) // 收藏组标题，使用国际化翻译
        },
        ...groupTopicsByTime(unfavTopics) // 其他话题按时间分组
      ]
      : groupTopicsByTime(topics) // 如果没有收藏话题，所有话题按时间分组
}

/**
 * 导出所有话题相关的选择器
 */
export const topicSelectors = {
  currentActiveTopic,
  currentActiveTopicSummary,
  currentTopicLength,
  currentTopics,
  currentUnFavTopics,
  displayTopics,
  getTopicById,
  groupedTopicsSelector,
  isCreatingTopic,
  searchTopics
}
