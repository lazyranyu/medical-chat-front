import { Icon } from "@lobehub/ui"
import { Skeleton } from "antd"
import { useTheme } from "antd-style"
import { ChevronUp, CornerDownLeft, LucideCommand } from "lucide-react"
import { memo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Center, Flexbox } from "react-layout-kit"

import { useUserStore } from "@/store/user"
import { preferenceSelectors } from "@/store/user/selectors"
import { isMacOS } from "@/utils/platform"
import chat from "@/locales/default/chat";
// // 静态配置项
// const staticUseCmdEnterToSend = true; // 模拟用户偏好设置（true=使用Cmd+Enter发送）

const ShortcutHint = memo(() => {
  const { t } = useTranslation("chat")
  const theme = useTheme()
  const useCmdEnterToSend = useUserStore(preferenceSelectors.useCmdEnterToSend)
  //   // 替换原有的状态获取
  //   const useCmdEnterToSend = staticUseCmdEnterToSend;

  const [isMac, setIsMac] = useState()

  useEffect(() => {
    setIsMac(isMacOS())
  }, [])

  const cmdEnter = (
      <Flexbox gap={2} horizontal>
        {typeof isMac === "boolean" ? (
            <Icon icon={isMac ? LucideCommand : ChevronUp} />
        ) : (
            <Skeleton.Node active style={{ height: "100%", width: 12 }}>
              {" "}
            </Skeleton.Node>
        )}
        <Icon icon={CornerDownLeft} />
      </Flexbox>
  )

  const enter = (
      <Center>
        <Icon icon={CornerDownLeft} />
      </Center>
  )

  const sendShortcut = useCmdEnterToSend ? cmdEnter : enter

  const wrapperShortcut = useCmdEnterToSend ? enter : cmdEnter

  return (
      <Flexbox
          gap={4}
          horizontal
          style={{
            color: theme.colorTextDescription,
            fontSize: 12,
            marginRight: 12
          }}
      >
        {sendShortcut}
        <span>{chat.input.send}</span>
        <span>/</span>
        {wrapperShortcut}
        <span>{chat.input.warp}</span>
      </Flexbox>
  )
})

export default ShortcutHint
