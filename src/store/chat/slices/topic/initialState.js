/**
 * 聊天话题切片 - 初始状态
 * 
 * 定义了对话话题管理相关的初始状态
 * 话题用于组织和分类不同的对话内容
 */

export const initialTopicState = {
    activeTopicId: null, // 当前活动的话题ID
    creatingTopic: false, // 是否正在创建新话题的标志
    isSearchingTopic: false, // 是否正在搜索话题的标志
    searchTopics: [], // 搜索结果中的话题列表
    topicLoadingIds: [], // 正在加载中的话题ID列表
    topicMaps: {}, // 话题映射表，以ID为键存储所有话题
    topicSearchKeywords: "", // 话题搜索关键词
    topicsInit: false // 话题是否已初始化的标志
}
