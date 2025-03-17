/**
 * 状态管理中间件 - 开发工具
 * 
 * 本文件实现了一个用于Zustand状态管理的开发工具中间件
 * 该中间件可以根据URL参数动态启用Redux DevTools，方便调试状态变化
 */

import { optionalDevtools } from "zustand-utils" // 引入可选的开发工具中间件
import { isDev } from "@/utils/env" // 引入环境判断工具

/**
 * 创建开发工具中间件
 * 
 * @param {string} name - 状态模块名称，用于在URL参数和DevTools中标识
 * @returns {Function} 返回一个中间件函数，用于包装store初始化函数
 */
export const createDevtools = name => initializer => {
    let showDevtools = false

    // 检查URL参数来决定是否显示开发工具
    // 例如：?debug=chat 将启用chat模块的开发工具
    if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        const debug = url.searchParams.get("debug")
        if (debug?.includes(name)) {
            showDevtools = true
        }
    }

    // 使用optionalDevtools包装初始化函数
    // 只有当showDevtools为true时才会启用Redux DevTools
    return optionalDevtools(showDevtools)(initializer, {
        name: `LobeChat_${name}` + (isDev ? "_DEV" : "") // 在开发环境中添加_DEV后缀
    })
}
