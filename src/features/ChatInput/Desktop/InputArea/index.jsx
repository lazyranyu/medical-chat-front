import { TextArea } from "@lobehub/ui"
import { createStyles } from "antd-style"
import { memo, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

import { useUserStore } from "@/store/user"
import { preferenceSelectors } from "@/store/user/selectors"
import { isCommandPressed } from "@/utils/keyboard"

import { useAutoFocus } from "../useAutoFocus"

const useStyles = createStyles(({ css }) => {
  return {
    textarea: css`
      resize: none !important;

      height: 100% !important;
      padding-block: 0;
      padding-inline: 24px;

      line-height: 1.5;

      box-shadow: none !important;
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `
  }
})
// // 静态配置项
// const staticUseCmdEnterToSend = true; // 模拟用户偏好设置（true=使用Cmd+Enter发送）

const InputArea = memo(({ onSend, value, loading, onChange }) => {
  const { t } = useTranslation("chat")
  const { styles } = useStyles()
  const ref = useRef(null)
  const isChineseInput = useRef(false)

  const useCmdEnterToSend = useUserStore(preferenceSelectors.useCmdEnterToSend)
  // // 替换原有的状态获取
  // const useCmdEnterToSend = staticUseCmdEnterToSend;

  useAutoFocus(ref)

  const hasValue = !!value

  useEffect(() => {
    const fn = e => {
      if (hasValue) {
        // set returnValue to trigger alert modal
        // Note: No matter what value is set, the browser will display the standard text
        e.returnValue = "你有正在输入中的内容，确定要离开吗？"
      }
    }

    window.addEventListener("beforeunload", fn)
    return () => {
      window.removeEventListener("beforeunload", fn)
    }
  }, [hasValue])

  return (
      <div className={styles.textareaContainer}>
        <TextArea
            autoFocus
            className={styles.textarea}
            onBlur={e => {
              onChange?.(e.target.value)
            }}
            onChange={e => {
              onChange?.(e.target.value)
            }}
            onCompositionEnd={() => {
              isChineseInput.current = false
            }}
            onCompositionStart={() => {
              isChineseInput.current = true
            }}
            onPressEnter={e => {
              if (loading || e.altKey || e.shiftKey || isChineseInput.current)
                return

              // eslint-disable-next-line unicorn/consistent-function-scoping
              const send = () => {
                // avoid inserting newline when sending message.
                // refs: https://github.com/lobehub/lobe-chat/pull/989
                e.preventDefault()

                onSend()
              }
              const commandKey = isCommandPressed(e)

              // when user like cmd + enter to send message
              if (useCmdEnterToSend) {
                if (commandKey) send()
              } else {
                // cmd + enter to wrap
                if (commandKey) {
                  onChange?.(e.target.value + "\n")
                  return
                }

                send()
              }
            }}
            placeholder={t("sendPlaceholder")}
            ref={ref}
            type={"pure"}
            value={value}
        />
      </div>
  )
})

InputArea.displayName = "DesktopInputArea"

export default InputArea
