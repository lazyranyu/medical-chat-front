/**
 * 聊天模块状态管理 - 辅助函数
 * 
 * 本文件提供了聊天模块中常用的辅助函数
 * 这些函数用于处理消息数据、计算token数量等操作
 */

// 注释掉的token计数功能，可能在将来启用
// import { encodeAsync } from "@/utils/tokenizer"
//
// /**
//  * 计算消息列表的总token数量
//  * @param {Array} messages - 消息列表
//  * @returns {Promise<number>} 消息内容的总token数
//  */
// export const getMessagesTokenCount = async messages =>
//     encodeAsync(messages.map(m => m.content).join(""))

/**
 * 根据ID查找消息
 * @param {Array} messages - 消息列表
 * @param {string} id - 要查找的消息ID
 * @returns {Object|undefined} 找到的消息对象，如果未找到则返回undefined
 */
export const getMessageById = (messages, id) => messages.find(m => m.id === id)

/**
 * 根据历史记录设置获取截取后的消息列表
 * 用于限制发送给AI的历史消息数量
 * 
 * @param {Array} messages - 完整的消息列表
 * @param {Object} options - 截取选项
 * @param {boolean} options.enableHistoryCount - 是否启用历史记录数量限制
 * @param {number} options.historyCount - 要保留的历史记录数量
 * @param {boolean} options.includeNewUserMessage - 是否包含新的用户消息
 * @returns {Array} 截取后的消息列表
 */
const getSlicedMessages = (messages, options) => {
    // 如果未启用历史记录数量限制，返回所有消息
    if (!options.enableHistoryCount || options.historyCount === undefined)
        return messages

    // 如果包含用户新发送的消息，历史记录数量需要+1
    const messagesCount = !!options.includeNewUserMessage
        ? options.historyCount + 1
        : options.historyCount

    // 如果历史记录数量为负数或0，返回空数组
    if (messagesCount <= 0) return []

    // 如果历史记录数量为正数，返回最后N条消息
    return messages.slice(-messagesCount)
}

/**
 * 导出所有聊天辅助函数
 */
export const chatHelpers = {
    getMessageById,
    // getMessagesTokenCount, // 暂时注释掉token计数功能
    getSlicedMessages
}
