// Entry component
import { App } from "antd"
import { memo, useEffect } from "react"

let message
let notification
let modal

export default memo(() => {
  const staticFunction = App.useApp()
  message = staticFunction.message
  modal = staticFunction.modal
  notification = staticFunction.notification

  // 设置React 19兼容性标志
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 设置全局变量
      window.__ANT_DESIGN_REACT19_COMPATIBLE__ = true;

      // 重写console.error来过滤掉antd的React兼容性警告
      const originalError = console.error;
      if (!window.__ANTD_ERROR_FILTERED__) {
        console.error = function(...args) {
          // 过滤掉antd的React兼容性警告
          if (args[0] && typeof args[0] === 'string' &&
              args[0].includes('[antd: compatible] antd v5 support React is 16 ~ 18')) {
            return;
          }
        };
        window.__ANTD_ERROR_FILTERED__ = true;
      }
    }
  }, []);

  return null
})

export { message, modal, notification }
