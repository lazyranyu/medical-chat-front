/**
 * 聊天消息切片 - Reducer
 * 
 * 定义了处理消息状态变更的纯函数
 * 使用immer库实现不可变状态更新
 */

import isEqual from "fast-deep-equal" // 用于深度比较对象是否相等
import { produce } from "immer" // 用于不可变状态更新的库

import { merge } from "@/utils/merge" // 自定义合并对象的工具函数

/**
 * 消息状态的reducer函数
 * 根据不同的action类型处理消息状态的更新
 * 
 * @param {Array} state - 当前消息状态
 * @param {Object} payload - 包含action类型和数据的载荷对象
 * @returns {Array} 更新后的消息状态
 */
export const messagesReducer = (state, payload) => {
  switch (payload.type) {
    case 'updateMessage': {
      return produce(state, (draftState) => {
        const { id, value } = payload;
        const index = draftState.findIndex((i) => i.id === id);
        if (index < 0) return;

        draftState[index] = merge(draftState[index], { ...value, updatedAt: Date.now() });
      });
    }

    case "updateMessageExtra": {
      // 更新消息的额外信息字段
      return produce(state, draftState => {
        const { id, key, value } = payload
        const message = draftState.find(i => i.id === id)
        if (!message) return // 如果找不到消息，不做任何操作

        // 如果消息没有extra字段，创建一个新的
        if (!message.extra) {
          message.extra = {
            [key]: value
          }
        } else {
          // 如果值相同，不做任何更改
          if (isEqual(message.extra[key], value)) return
          
          // 更新extra中的特定字段
          message.extra[key] = value
        }
        
        // 更新消息的时间戳
        message.updatedAt = Date.now()
      })
    }

    case "updatePluginState": {
      return produce(state, draftState => {
        const { id, key, value } = payload
        const message = draftState.find(i => i.id === id)
        if (!message) return

        let newState
        if (!message.pluginState) {
          newState = {
            [key]: value
          }
        } else {
          newState = merge(message.pluginState, { [key]: value })
        }

        if (isEqual(message.pluginState, newState)) return

        message.pluginState = newState
        message.updatedAt = Date.now()
      })
    }

    case "updateMessagePlugin": {
      return produce(state, draftState => {
        const { id, value } = payload
        const message = draftState.find(i => i.id === id)
        if (!message || message.role !== "tool") return

        message.plugin = merge(message.plugin, value)
        message.updatedAt = Date.now()
      })
    }

    case "addMessageTool": {
      return produce(state, draftState => {
        const { id, value } = payload
        const message = draftState.find(i => i.id === id)
        if (!message || message.role !== "assistant") return

        if (!message.tools) {
          message.tools = [value]
        } else {
          const index = message.tools.findIndex(tool => tool.id === value.id)

          if (index > 0) return
          message.tools.push(value)
        }

        message.updatedAt = Date.now()
      })
    }

    case "deleteMessageTool": {
      return produce(state, draftState => {
        const { id, tool_call_id } = payload
        const message = draftState.find(i => i.id === id)
        if (!message || message.role !== "assistant" || !message.tools) return

        message.tools = message.tools.filter(tool => tool.id !== tool_call_id)

        message.updatedAt = Date.now()
      })
    }

    case "updateMessageTools": {
      return produce(state, draftState => {
        const { id, value, tool_call_id } = payload
        const message = draftState.find(i => i.id === id)
        if (!message || message.role !== "assistant" || !message.tools) return

        const index = message.tools.findIndex(tool => tool.id === tool_call_id)

        if (index < 0) return
        message.tools[index] = merge(message.tools[index], value)

        message.updatedAt = Date.now()
      })
    }

    case "createMessage": {
      return produce(state, draftState => {
        const { value, id } = payload

        draftState.push({
          ...value,
          createdAt: Date.now(),
          id,
          meta: {},
          updatedAt: Date.now()
        })
      })
    }
    case "deleteMessage": {
      // 删除指定ID的消息
      return produce(state, draftState => {
        const { id } = payload
        const index = draftState.findIndex(i => i.id === id)
        if (index < 0) return // 如果找不到消息，不做任何操作
        
        // 从数组中移除消息
        draftState.splice(index, 1)
      })
    }
    case "deleteMessages": {
      return produce(state, draft => {
        const { ids } = payload

        return draft.filter(item => {
          return !ids.includes(item.id)
        })
      })
    }
    case "addMessage": {
      // 添加新消息到列表
      return produce(state, draftState => {
        const { message } = payload
        
        // 检查消息是否已存在
        const existingIndex = draftState.findIndex(i => i.id === message.id)
        
        // 如果消息已存在，更新它
        if (existingIndex >= 0) {
          draftState[existingIndex] = merge(draftState[existingIndex], message)
          return
        }
        
        // 否则添加新消息
        draftState.push(message)
      })
    }
    case "resetMessages": {
      // 重置消息列表为指定的新列表
      return payload.messages
    }
    case "clearAllMessages": {
      // 清空所有消息
      return []
    }
    case "replaceMessageId": {
      // 替换临时消息ID为后端返回的真实ID
      return produce(state, draftState => {
        const { oldId, newId } = payload
        const index = draftState.findIndex(i => i.id === oldId)
        if (index < 0) return // 如果找不到消息，不做任何操作
        
        // 更新消息ID
        draftState[index].id = newId
      })
    }
    default: {
      throw new Error("暂未实现的 type，请检查 reducer")
    }
  }
}
