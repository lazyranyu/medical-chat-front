/**
 * 聊天线程切片 - Reducer
 * 
 * 定义了处理线程状态变更的纯函数
 * 使用immer库实现不可变状态更新
 */

import { produce } from "immer" // 用于不可变状态更新的库

/**
 * 线程状态的reducer函数
 * 根据不同的action类型处理线程状态的更新
 * 
 * @param {Array} state - 当前线程状态，默认为空数组
 * @param {Object} payload - 包含action类型和数据的载荷对象
 * @returns {Array} 更新后的线程状态
 */
export const threadReducer = (state = [], payload) => {
  switch (payload.type) {
    case "updateThread": {
      // 更新指定ID的线程内容
      return produce(state, draftState => {
        const { value, id } = payload
        const threadIndex = draftState.findIndex(thread => thread.id === id)

        // 如果找到线程，更新其内容和时间戳
        if (threadIndex !== -1) {
          draftState[threadIndex] = {
            ...draftState[threadIndex],
            ...value,
            updatedAt: new Date() // 更新时间戳
          }
        }
      })
    }

    case "deleteThread": {
      // 删除指定ID的线程
      return produce(state, draftState => {
        const threadIndex = draftState.findIndex(
            thread => thread.id === payload.id
        )
        // 如果找到线程，从数组中移除
        if (threadIndex !== -1) {
          draftState.splice(threadIndex, 1)
        }
      })
    }

    default: {
      // 对于未知的action类型，返回原状态
      return state
    }
  }
}
