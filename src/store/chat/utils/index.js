import { produce } from "immer"

export const preventLeavingFn = e => {
  // set returnValue to trigger alert modal
  // Note: No matter what value is set, the browser will display the standard text
  e.returnValue = "你有正在生成中的请求，确定要离开吗？"
}

export const toggleBooleanList = (ids, id, loading) => {
  return produce(ids || [], draft => {
    if (loading) {
      if (!draft.includes(id)) draft.push(id)
    } else {
      const index = draft.indexOf(id)
      if (index >= 0) draft.splice(index, 1)
    }
  })
}

// 优化消息更新的防抖函数
// 与常规防抖不同，该函数确保文本流在特定条件下立即更新
export const optimizedDebounce = (lastUpdateTime, currentLength) => {
  const now = Date.now();
  // 如果没有上次更新时间，或者已经过了30ms，或者每10个字符更新一次
  return !lastUpdateTime || 
         now - lastUpdateTime > 30 || 
         currentLength % 10 === 0;
}
