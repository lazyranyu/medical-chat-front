import { useState, useEffect } from 'react';

/**
 * 客户端渲染保护钩子
 * 确保组件只在客户端渲染，避免水合错误
 *
 * @param {any} initialValue - 客户端渲染后的初始值
 * @returns {any|null} 客户端渲染后返回初始值，否则返回 null
 */
export function useClientOnly(initialValue) {
    const [value, setValue] = useState(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return value;
}