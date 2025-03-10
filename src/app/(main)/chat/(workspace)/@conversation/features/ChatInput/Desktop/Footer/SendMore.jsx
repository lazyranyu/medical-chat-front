import { Icon } from "@lobehub/ui"
import { Button, Dropdown } from "antd"
import { createStyles } from "antd-style"
import {
  BotMessageSquare,
  LucideCheck,
  LucideChevronDown,
  MessageSquarePlus
} from "lucide-react"
import { memo } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"

import HotKeys from "@/components/HotKeys"
import { ALT_KEY } from "@/const/hotkeys"
import { useSendMessage } from "@/features/ChatInput/useSend"
import { useChatStore } from "@/store/chat"
import { useUserStore } from "@/store/user"
import { preferenceSelectors } from "@/store/user/selectors"
import { useStoreSelector } from '@/hooks/useStoreSelector';
import chat from "@/locales/default/chat";
const useStyles = createStyles(({ css, prefixCls }) => {
  return {
    arrow: css`
      &.${prefixCls}-btn.${prefixCls}-btn-icon-only {
        width: 28px;
      }
    `
  }
})
// // 静态配置和模拟函数
// const staticUseCmdEnterToSend = true; // 模拟用户偏好设置：是否使用 Cmd+Enter 发送
// const staticUpdatePreference = (prefs) => {
//   console.log('Preference updated (mock):', prefs);
//   // 这里可以添加模拟更新逻辑
// };
//
// const staticAddAIMessage = () => {
//   console.log('Add AI message triggered (static mock)');
//   // 这里可以添加模拟 AI 消息逻辑
// };
const SendMore = memo(({ disabled, isMac }) => {

  const { styles } = useStyles()

  // 使用useStoreSelector替代直接使用useUserStore
  const useCmdEnterToSend = useStoreSelector(useUserStore, preferenceSelectors.useCmdEnterToSend);
  const updatePreference = useStoreSelector(useUserStore, state => state.updatePreference);
  
  // 使用useStoreSelector替代直接使用useChatStore
  const addAIMessage = useStoreSelector(useChatStore, state => state.addAIMessage);
  
  // // 替换原有的状态获取
  // const [useCmdEnterToSend, updatePreference] = [
  //   staticUseCmdEnterToSend,  // 使用静态变量代替 preferenceSelectors
  //   staticUpdatePreference    // 使用静态方法代替 store 的 updatePreference
  // ];
  //
  // const addAIMessage = staticAddAIMessage; // 替换聊天 store 的 action

  const { send: sendMessage } = useSendMessage()

  const hotKey = [ALT_KEY, "enter"].join("+")
  useHotkeys(
      hotKey,
      (keyboardEvent, hotkeysEvent) => {
        console.log(keyboardEvent, hotkeysEvent)
        sendMessage({ onlyAddUserMessage: true })
      },
      {
        enableOnFormTags: true,
        preventDefault: true
      }
  )

  return (
      <Dropdown
          disabled={disabled}
          menu={{
            items: [
              {
                icon: !useCmdEnterToSend ? <Icon icon={LucideCheck} /> : <div />,
                key: "sendWithEnter",
                label: chat.input.sendWithEnter,
                onClick: () => {
                  updatePreference({ useCmdEnterToSend: false })
                }
              },
              {
                icon: useCmdEnterToSend ? <Icon icon={LucideCheck} /> : <div />,
                key: "sendWithCmdEnter",
                label: chat.input.sendWithCmdEnter.replace(
                    "{meta}",
                    typeof isMac === "boolean" ? (isMac ? "⌘" : "Ctrl") : "…"
                ),
                onClick: () => {
                  updatePreference({ useCmdEnterToSend: true })
                }
              },
              { type: "divider" },
              {
                icon: <Icon icon={BotMessageSquare} />,
                key: "addAi",
                label: chat.input.addAi,
                onClick: () => {
                  addAIMessage()
                }
              },
              {
                icon: <Icon icon={MessageSquarePlus} />,
                key: "addUser",
                label: (
                    <Flexbox gap={24} horizontal>
                      {chat.input.addUser}
                      <HotKeys keys={hotKey} />
                    </Flexbox>
                ),
                onClick: () => {
                  sendMessage({ onlyAddUserMessage: true })
                }
              }
            ]
          }}
          placement={"topRight"}
          trigger={["hover"]}
      >
        <Button
            aria-label={chat.input.more}
            className={styles.arrow}
            icon={<Icon icon={LucideChevronDown} />}
            type={"primary"}
        />
      </Dropdown>
  )
})

SendMore.displayName = "SendMore"

export default SendMore
