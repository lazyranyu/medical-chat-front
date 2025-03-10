// src/hooks/useStoreSelector.js
import { useCallback, useMemo } from 'react';
import { shallow } from 'zustand/shallow';

/**
 * 创建稳定的选择器钩子，支持 SSR
 * @param {Function} useStore - Zustand store 钩子
 * @param {Function} selector - 选择器函数
 * @param {Function} [equalityFn=shallow] - 比较函数
 * @returns {any} 选择的状态
 */
export const useStoreSelector = (useStore, selector, equalityFn = shallow) => {
  // 缓存选择器函数
  const stableSelector = useCallback(selector, [selector]);

  // 获取状态
  const state = useStore(stableSelector, equalityFn);

  // 使用 useMemo 缓存结果，避免 SSR 中的无限循环
  return useMemo(() => state, [state]);
};