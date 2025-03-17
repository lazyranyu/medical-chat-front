import { Icon } from "@lobehub/ui"
import { Button } from "antd"
import { ListEnd } from "lucide-react"
import { memo } from "react"
import { useTranslation } from "react-i18next"

import { useStyles } from "./style"
import chat from "@/locales/default/chat";

const BackBottom = memo(({ visible, onScrollToBottom }) => {
  const { styles, cx } = useStyles()


  return (
      <Button
          className={cx(styles.container, visible && styles.visible)}
          icon={<Icon icon={ListEnd} />}
          onClick={onScrollToBottom}
          size={"small"}
      >
        {chat.backToBottom}
      </Button>
  )
})

export default BackBottom
