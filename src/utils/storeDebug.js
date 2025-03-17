/**
 * 根据命名空间创建一个生成标准化 action 类型和 payload 的函数。
 *
 * @param {string} namespace - 命名空间前缀，用于标识 action 的归属模块
 * @returns {Function} 返回一个函数，该函数接收 type 和 payload 参数并生成标准化的 action 对象或类型字符串
 */
export const setNamespace = namespace => {
    return (type, payload) => {
        // 生成完整的 action 类型名称，自动过滤空值的命名空间或类型
        const name = [namespace, type].filter(Boolean).join("/");
        return payload
            ? {
                payload,
                type: name
            }
            : name;
    };
};
