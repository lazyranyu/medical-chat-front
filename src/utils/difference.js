import isEqual from "fast-deep-equal"
import { isArray, isObject, transform } from "lodash-es"

/**
 * 比较两个对象并返回差异对象（当数组存在差异时直接返回新值）
 * 适用于配置项的差异对比场景，遵循以下特殊规则：
 * 1. 当字段值为数组时，直接进行全等比较，不进行递归对比
 * 2. 当字段值为对象时，递归进行深度对比
 *
 * @param {Object} object 新对象（对比后的对象）
 * @param {Object} base 基准对象（对比前的原始对象）
 * @returns {Object} 差异对象，结构规则：
 * - 仅包含变化字段
 * - 数组变化时直接存储新数组
 * - 对象变化时存储递归对比结果
 */
export const difference = (object, base) => {
    // 核心对比方法使用transform优化对象遍历
    const changes = (object, base) =>
        transform(object, (result, value, key) => {
            // 处理数组类型值的对比逻辑
            if (isArray(value) && isArray(base[key])) {
                /* 数组全等比较：当数组内容不同时，直接存储新数组 */
                if (!isEqual(value, base[key])) {
                    result[key] = value
                }
            }
            // 处理非数组类型的值对比
            else if (!isEqual(value, base[key])) {
                /* 对象递归处理：当值为对象时递归对比，否则直接存储新值 */
                result[key] =
                    isObject(value) && isObject(base[key])
                        ? changes(value, base[key])
                        : value
            }
        })

    return changes(object, base)
}
