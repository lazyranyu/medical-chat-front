import { Icon } from "@lobehub/ui"
import { Button } from "antd"
import { ListEnd } from "lucide-react"
import { memo } from "react"
import { useTranslation } from "react-i18next"

import { useStyles } from "./style"

const BackBottom = memo(({ visible, onScrollToBottom }) => {
  const { styles, cx } = useStyles()

  const { t } = useTranslation("chat")

  return (
      <Button
          className={cx(styles.container, visible && styles.visible)}
          icon={<Icon icon={ListEnd} />}
          onClick={onScrollToBottom}
          size={"small"}
      >
        {t("backToBottom", { defaultValue: "Back to bottom" })}
      </Button>
  )
})

export default BackBottom
