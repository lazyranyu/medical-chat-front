/**
 * 聊天话题切片 - 动作
 * 
 * 定义了话题相关的状态更新动作
 * 包括话题的创建、更新、删除、搜索等操作
 */

// 注意：为了使代码更加逻辑化和可读，我们禁用了自动排序键的eslint规则
// 不要删除第一行
import isEqual from "fast-deep-equal" // 深度比较对象是否相等的工具
import { t } from "i18next" // 国际化翻译函数
import useSWR, { mutate } from "swr" // SWR数据获取和更新工具

import { chainSummaryTitle } from "@/chains/summaryTitle" // 话题标题摘要生成链
import { message } from "@/components/AntdStaticMethods" // Ant Design消息提示组件
import { LOADING_FLAT } from "@/const/message" // 加载状态常量
import { useClientDataSWR } from "@/libs/swr" // 客户端数据SWR hook
import { chatService} from "@/api/chatService";
import { messageService} from "@/api/message";
import { topicService, topicSummaryService } from "@/api/topic";
import { useUserStore } from "@/store/user" // 用户状态管理hook
import { systemAgentSelectors } from "@/store/user/selectors" // 系统代理选择器
import { merge } from "@/utils/merge" // 合并对象的工具函数
import { setNamespace } from "@/utils/storeDebug" // 设置调试命名空间的工具

import { messageSelectors } from "@/store/chat/selectors" // 消息选择器
import { topicReducer } from "./reducer" // 话题reducer
import { topicSelectors } from "@/store/chat/selectors" // 话题选择器

// 设置调试命名空间为"t"
const n = setNamespace("t")

// SWR获取话题的键
const SWR_USE_FETCH_TOPIC = "SWR_USE_FETCH_TOPIC"
// SWR搜索话题的键
const SWR_USE_SEARCH_TOPIC = "SWR_USE_SEARCH_TOPIC"

/**
 * 创建话题切片
 * 定义了所有话题相关的动作
 * 
 * @param {Function} set - Zustand的set函数，用于更新状态
 * @param {Function} get - Zustand的get函数，用于获取当前状态
 * @returns {Object} 包含所有话题相关动作的对象
 */
export const chatTopic = (set, get) => ({
    /**
     * 打开新话题或保存当前消息到话题
     * 如果已有活动话题，则切换到默认话题；否则创建新话题
     */
    openNewTopicOrSaveTopic: async () => {
        const { switchTopic, saveToTopic, refreshMessages, activeTopicId } = get()
        const hasTopic = !!activeTopicId

        if (hasTopic) switchTopic()
        else {
            await saveToTopic()
            refreshMessages()
        }
    },

    /**
     * 创建新话题
     * 使用当前活动会话的消息创建一个新话题
     * 
     * @returns {string} 新创建的话题ID
     */
    createTopic: async () => {
        const {internal_createTopic } = get()

        const messages = messageSelectors.activeBaseChats(get())

        // 设置正在创建话题的状态
        set({ creatingTopic: true }, false, n("creatingTopic/start"))
        const topicId = await internal_createTopic({
            title: t("defaultTitle", { ns: "topic" }), // 使用默认标题
            messages: messages.map(m => m.id) // 收集所有消息ID
        })
        // 设置创建话题完成的状态
        set({ creatingTopic: false }, false, n("creatingTopic/end"))

        return topicId
    },

    /**
     * 保存当前消息到新话题
     * 创建新话题并将当前消息绑定到该话题，然后自动生成标题
     * 
     * @returns {string|undefined} 新创建的话题ID，如果没有消息则返回undefined
     */
    saveToTopic: async () => {
        // 如果没有消息，则停止
        const messages = messageSelector.activeBaseChats(get())
        if (messages.length === 0) return

        const { activeId, summaryTopicTitle, internal_createTopic } = get()

        // 1. 创建话题并绑定这些消息
        const topicId = await internal_createTopic({
            title: t("defaultTitle", { ns: "topic" }), // 使用默认标题
            messages: messages.map(m => m.id) // 收集所有消息ID
        })

        // 设置话题加载状态
        get().internal_updateTopicLoading(topicId, true)
        // 2. 自动总结话题标题
        // 我们不需要等待总结完成，让它异步运行
        summaryTopicTitle(topicId, messages)

        return topicId
    },

    /**
     * 复制话题
     * 创建指定话题的副本，包括其所有消息
     * 
     * @param {string} id - 要复制的话题ID
     */
    duplicateTopic: async id => {
        const { refreshTopic, switchTopic } = get()

        // 获取要复制的话题
        const topic = topicSelectors.getTopicById(id)(get())
        if (!topic) return

        // 生成新标题，格式为"原标题的副本"
        const newTitle = t("duplicateTitle", { ns: "chat", title: topic?.title })

        // 显示加载消息
        message.loading({
            content: t("duplicateLoading", { ns: "topic" }),
            key: "duplicateTopic",
            duration: 0
        })

        // 调用API克隆话题
        const newTopicId = await topicService.cloneTopic(id, newTitle)
        // 刷新话题列表
        await refreshTopic()
        // 销毁加载消息
        message.destroy("duplicateTopic")
        // 显示成功消息
        message.success(t("duplicateSuccess", { ns: "topic" }))

        // 切换到新创建的话题
        await switchTopic(newTopicId)
    },

    /**
     * 自动总结话题标题
     * 使用AI生成话题的标题摘要
     * 
     * @param {string} topicId - 话题ID
     * @param {Array} messages - 消息列表
     */
    summaryTopicTitle: async (topicId, msgs) => {
        const {
            internal_updateTopicTitleInSummary,
            internal_updateTopicLoading
        } = get()
        // 获取话题对象
        const topic = topicSelectors.getTopicById(topicId)(get())
        if (!topic) return

        // 设置加载中的标题
        internal_updateTopicTitleInSummary(topicId, LOADING_FLAT)

        let output = ""

        // 获取当前话题的代理配置
        const topicConfig = systemAgentSelectors.topic(useUserStore.getState())

        // 自动总结话题标题
        const data = await topicSummaryService.summaryTopicTitle({
            topic: { id: topicId },
            messages: msgs,
        })

        // 完成时更新话题标题
        await get().internal_updateTopic(topicId, { title: data.title })

        // 实时更新标题
        internal_updateTopicTitleInSummary(topicId, data.title)
    },

    /**
     * 收藏/取消收藏话题
     * 
     * @param {string} id - 话题ID
     * @param {boolean} favorite - 是否收藏
     */
    favoriteTopic: async (id, favorite) => {
        await get().internal_updateTopic(id, { favorite })
    },

    /**
     * 更新话题标题
     * 
     * @param {string} id - 话题ID
     * @param {string} title - 新标题
     */
    updateTopicTitle: async (id, title) => {
        await get().internal_updateTopic(id, { title })
    },

    /**
     * 自动重命名话题标题
     * 获取话题的所有消息并使用AI重新生成标题
     * 
     * @param {string} id - 话题ID
     */
    autoRenameTopicTitle: async id => {
        const {
            summaryTopicTitle,
            internal_updateTopicLoading
        } = get()

        // 设置加载状态
        internal_updateTopicLoading(id, true)
        // 获取话题的所有消息
        const messages = await messageService.getMessages(id)

        // 总结新标题
        await summaryTopicTitle(id, messages)
        // 取消加载状态
        internal_updateTopicLoading(id, false)
    },

    /**
     * 使用SWR获取话题列表
     * 当启用时，会自动获取并更新话题列表
     * 
     * @param {boolean} enable - 是否启用
     * @param {string} sessionId - 会话ID
     * @returns {Object} SWR响应对象
     */
    useFetchTopics: (enable) =>
        useClientDataSWR(
            enable ? [SWR_USE_FETCH_TOPIC] : null,
            async ([, sessionId]) => topicService.getTopics({ sessionId }),
            {
                suspense: true,
                fallbackData: [],
                onSuccess: topics => {
                    const nextMap = { ...get().topicMaps, [sessionId]: topics }

                    // 如果话题已初始化且映射没有变化，不需要更新
                    if (get().topicsInit && isEqual(nextMap, get().topicMaps)) return

                    set(
                        { topicMaps: nextMap, topicsInit: true },
                        false,
                        n("useFetchTopics(success)", { sessionId })
                    )
                }
            }
        ),

    /**
     * 搜索话题
     * 根据关键词搜索指定会话中的话题
     * 
     * @param {string} keywords - 搜索关键词
     * @returns {Object} SWR响应对象
     */
    useSearchTopics: (keywords) =>
        useSWR(
            [SWR_USE_SEARCH_TOPIC, keywords],
            ([, keywords]) =>
                topicService.searchTopics(keywords),
            {
                onSuccess: data => {
                    set(
                        { searchTopics: data },
                        false,
                        n("useSearchTopics(success)", { keywords })
                    )
                }
            }
        ),

    /**
     * 切换当前活动话题
     * 
     * @param {string} id - 要切换到的话题ID，如果为空则切换到默认话题
     * @param {boolean} skipRefreshMessage - 是否跳过刷新消息
     */
    switchTopic: async (id, skipRefreshMessage) => {
        set(
            { activeTopicId: !id ? null : id, activeThreadId: undefined },
            false,
            n("toggleTopic")
        )

        // 如果不跳过刷新消息，则刷新消息列表
        if (skipRefreshMessage) return
        await get().refreshMessages()
    },

    /**
     * 删除当前会话的所有话题
     * 删除后切换到默认话题
     */
    removeSessionTopics: async () => {
        const { switchTopic, activeId, refreshTopic } = get()

        // 删除当前会话的所有话题
        await topicService.removeTopics(activeId)
        // 刷新话题列表
        await refreshTopic()

        // 切换到默认话题
        switchTopic()
    },

    /**
     * 删除所有话题
     * 删除所有会话中的所有话题
     */
    removeAllTopics: async () => {
        const { refreshTopic } = get()

        // 删除所有话题
        await topicService.removeAllTopic()
        // 刷新话题列表
        await refreshTopic()
    },

    /**
     * 删除指定话题
     * 删除话题及其所有消息，如果是当前活动话题则切换到默认话题
     * 
     * @param {string} id - 要删除的话题ID
     */
    removeTopic: async id => {
        const { activeId, activeTopicId, switchTopic, refreshTopic } = get()

        // 删除话题中的消息
        // TODO: 需要移除，因为服务器服务不需要调用它
        await messageService.removeMessagesByAssistant(activeId, id)

        // 删除话题
        await topicService.removeTopic(id)
        // 刷新话题列表
        await refreshTopic()

        // 如果删除的是当前活动话题，则切换到默认话题
        if (activeTopicId === id) switchTopic()
    },

    /**
     * 删除所有未收藏的话题
     * 删除后切换到默认话题
     */
    removeUnstarredTopic: async () => {
        const { refreshTopic, switchTopic } = get()
        // 获取所有未收藏的话题
        const topics = topicSelectors.currentUnFavTopics(get())

        // 批量删除话题
        await topicService.batchRemoveTopics(topics.map(t => t.id))
        // 刷新话题列表
        await refreshTopic()

        // 切换到默认话题
        switchTopic()
    },

    // 话题的内部处理方法

    /**
     * 内部方法：在摘要过程中更新话题标题
     * 
     * @param {string} id - 话题ID
     * @param {string} title - 新标题
     */
    internal_updateTopicTitleInSummary: (id, title) => {
        get().internal_dispatchTopic(
            { type: "updateTopic", id, value: { title } },
            "updateTopicTitleInSummary"
        )
    },

    /**
     * 刷新话题列表
     * 触发SWR重新获取数据
     * 
     * @returns {Promise} SWR重新验证的Promise
     */
    refreshTopic: async () => {
        return mutate([SWR_USE_FETCH_TOPIC, get().activeId])
    },

    /**
     * 内部方法：更新话题加载状态
     * 
     * @param {string} id - 话题ID
     * @param {boolean} loading - 是否正在加载
     */
    internal_updateTopicLoading: (id, loading) => {
        set(
            state => {
                if (loading) return { topicLoadingIds: [...state.topicLoadingIds, id] }

                return { topicLoadingIds: state.topicLoadingIds.filter(i => i !== id) }
            },
            false,
            n("updateTopicLoading")
        )
    },

    /**
     * 内部方法：更新话题
     * 
     * @param {string} id - 话题ID
     * @param {Object} data - 要更新的数据
     */
    internal_updateTopic: async (id, data) => {
        // 更新前端状态
        get().internal_dispatchTopic({ type: "updateTopic", id, value: data })

        // 设置加载状态
        get().internal_updateTopicLoading(id, true)
        // 更新数据库
        await topicService.updateTopic(id, data)
        // 刷新话题列表
        await get().refreshTopic()
        // 取消加载状态
        get().internal_updateTopicLoading(id, false)
    },

    /**
     * 内部方法：创建话题
     * 
     * @param {Object} params - 创建话题的参数
     * @returns {string} 新创建的话题ID
     */
    internal_createTopic: async params => {

        // 创建临时ID
        const tmpId = Date.now().toString()
        // 先在前端创建临时话题
        get().internal_dispatchTopic(
            { type: "addTopic", value: { ...params, id: tmpId } },
            "internal_createTopic"
        )

        // 设置临时话题的加载状态
        get().internal_updateTopicLoading(tmpId, true)
        // 调用API创建话题
        const topicId = await topicService.createTopic(params)
        // 取消临时话题的加载状态
        get().internal_updateTopicLoading(tmpId, false)

        // 设置新话题的加载状态
        get().internal_updateTopicLoading(topicId, true)
        // 刷新话题列表
        await get().refreshTopic()
        // 取消新话题的加载状态
        get().internal_updateTopicLoading(topicId, false)

        return topicId
    },

    /**
     * 内部方法：分发话题动作
     * 使用reducer处理话题状态更新
     * 
     * @param {Object} payload - 包含动作类型和数据的载荷
     * @param {string} action - 动作名称，用于调试
     */
    internal_dispatchTopic: (payload, action) => {
        // 使用reducer处理话题状态更新
        const nextTopics = topicReducer(
            topicSelectors.currentTopics(get()),
            payload
        )
        // 创建新的话题映射
        const nextMap = { ...get().topicMaps, [get().activeId]: nextTopics }

        // 如果映射没有变化，不需要更新
        if (isEqual(nextMap, get().topicMaps)) return

        // 更新状态
        set(
            { topicMaps: nextMap },
            false,
            action ?? n(`dispatchTopic/${payload.type}`)
        )
    }
})
