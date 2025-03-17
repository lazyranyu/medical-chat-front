import { isEmpty, mergeWith } from "lodash-es"

/**
 * 用于合并两个对象，如果目标对象中的属性是数组，则直接用源对象的值替换。
 *
 * @param {Object} target - 目标对象，将被合并的对象。
 * @param {Object} source - 源对象，提供合并的内容。
 * @returns {Object} 返回一个新的合并后的对象。
 */
export const merge = (target, source) =>
    mergeWith({}, target, source, (obj, src) => {
      if (Array.isArray(obj)) return src
    })


/**
 * 根据 ID 合并两个数组中的对象，支持深度合并和默认值处理。
 *
 * @param {Array<Object>} defaultItems - 默认配置项数组，每个对象必须包含唯一的 `id` 属性。
 * @param {Array<Object>} userItems - 用户提供的配置项数组，每个对象必须包含唯一的 `id` 属性。
 * @returns {Array<Object>} 返回合并后的数组，按以下规则：
 * - 如果用户配置项中存在与默认配置项相同的 ID，则合并两者，用户配置优先；
 * - 如果用户配置项中不存在某个默认配置项的 ID，则保留默认配置项；
 * - 如果用户配置项中存在默认配置项中没有的 ID，则直接添加到结果中。
 */
export const mergeArrayById = (defaultItems, userItems) => {
  // 创建一个 Map，用于快速查找默认配置项
  const defaultItemsMap = new Map(defaultItems.map(item => [item.id, item]))

  // 使用 Map 存储合并结果，确保重复 ID 的后项会覆盖前项
  const mergedItemsMap = new Map()

  // 遍历用户配置项，合并默认配置和用户配置
  userItems.forEach(userItem => {
    const defaultItem = defaultItemsMap.get(userItem.id)
    if (!defaultItem) {
      // 如果用户配置项在默认配置中不存在，则直接添加到合并结果中
      mergedItemsMap.set(userItem.id, userItem)
      return
    }

    // 创建一个新的合并对象，基于默认配置项
    const mergedItem = { ...defaultItem }
    Object.entries(userItem).forEach(([key, value]) => {
      if (
          value !== null &&
          value !== undefined &&
          !(typeof value === "object" && isEmpty(value))
      ) {
        // 如果用户配置项的值有效（非空、非空对象），则覆盖默认值
        mergedItem[key] = value
      }

      if (typeof value === "object" && !isEmpty(value)) {
        // 如果用户配置项的值是对象且非空，则递归合并
        mergedItem[key] = merge(defaultItem[key], value)
      }
    })

    // 将合并后的对象存储到结果 Map 中
    mergedItemsMap.set(userItem.id, mergedItem)
  })

  // 添加只存在于默认配置中的项
  defaultItems.forEach(item => {
    if (!mergedItemsMap.has(item.id)) {
      mergedItemsMap.set(item.id, item)
    }
  })

  // 将 Map 转换为数组并返回
  return Array.from(mergedItemsMap.values())
}
