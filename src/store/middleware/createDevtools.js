// 导入第三方工具库，用于在开发环境下提供状态管理的devtools支持
import { optionalDevtools } from "zustand-utils"

// 导入环境变量工具，用于判断当前环境是否为开发环境
import { isDev } from "@/utils/env"

/**
 * 创建一个根据环境条件启用或禁用devtools的高阶函数
 * @param {string} name - devtools的名称，用于在查询参数中识别
 * @returns {function} - 一个高阶函数，接受初始化函数作为参数，并根据条件应用devtools
 */
export const createDevtools = name => initializer => {
    // 默认不显示devtools
    let showDevtools = false

    // 当前环境为浏览器环境时，检查URL查询参数以决定是否显示devtools
    if (typeof window !== "undefined") {
        // 解析当前页面的URL
        const url = new URL(window.location.href)
        // 获取debug查询参数的值
        const debug = url.searchParams.get("debug")
        // 如果debug参数包含指定的name，则启用devtools
        if (debug?.includes(name)) {
            showDevtools = true
        }
    }

    // 根据是否显示devtools的条件，应用optionalDevtools，并传递相应的name
    // name根据当前环境附加后缀，开发环境附加"_DEV"
    return optionalDevtools(showDevtools)(initializer, {
        name: `LobeChat_${name}` + (isDev ? "_DEV" : "")
    })
}
