/**
 * 聊天话题切片 - Reducer
 * 
 * 定义了处理话题状态变更的纯函数
 * 使用immer库实现不可变状态更新
 */

import { produce } from "immer" // 用于不可变状态更新的库

/**
 * 话题状态的reducer函数
 * 根据不同的action类型处理话题状态的更新
 * 
 * @param {Array} state - 当前话题状态，默认为空数组
 * @param {Object} payload - 包含action类型和数据的载荷对象
 * @returns {Array} 更新后的话题状态
 */
export const topicReducer = (state = [], payload) => {
  // 确保state是数组
  const currentState = Array.isArray(state) ? state : []
  
  switch (payload.type) {
    case "addTopic": {
      // 添加新话题到列表
      return produce(currentState, draftState => {
        // 在列表开头添加新话题
        draftState.unshift({
          ...payload.value,
          createdAt: Date.now(), // 创建时间戳
          favorite: false, // 默认非收藏状态
          id: payload.value.id ?? Date.now().toString(), // 使用提供的ID或生成新ID
          updatedAt: Date.now() // 更新时间戳
        })

        // 对话题列表进行排序，收藏的话题排在前面
        return draftState.sort(
            (a, b) => Number(b.favorite) - Number(a.favorite)
        )
      })
    }

    case "updateTopic": {
      // 更新指定ID的话题内容
      return produce(currentState, draftState => {
        const { value, id } = payload
        const topicIndex = draftState.findIndex(topic => topic.id === id)

        // 如果找到话题，更新其内容和时间戳
        if (topicIndex !== -1) {
          // TODO: updatedAt 类型后续需要修改为 Date
          // @ts-ignore
          draftState[topicIndex] = {
            ...draftState[topicIndex],
            ...value,
            updatedAt: new Date() // 更新时间戳
          }
        }
      })
    }

    case "deleteTopic": {
      // 删除指定ID的话题
      return produce(currentState, draftState => {
        const topicIndex = draftState.findIndex(
            topic => topic.id === payload.id
        )
        // 如果找到话题，从数组中移除
        if (topicIndex !== -1) {
          draftState.splice(topicIndex, 1)
        }
      })
    }

    default: {
      // 对于未知的action类型，返回原状态
      return currentState
    }
  }
}
