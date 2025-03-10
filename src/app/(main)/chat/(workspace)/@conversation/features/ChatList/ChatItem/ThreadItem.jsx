import { Icon } from "@lobehub/ui"
import { createStyles } from "antd-style"
import dayjs from "dayjs"
import { ChevronRight } from "lucide-react"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"

import { useChatStore } from "@/store/chat"
import { chatSelectors } from "@/store/chat/selectors"

const useStyles = createStyles(({ css, token }) => ({
  active: css`
    background: ${token.colorFillTertiary};
  `,
  container: css`
    cursor: pointer;

    padding-block: 4px;
    padding-inline: 6px;

    font-size: 12px;

    border-radius: 6px;

    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  extra: css`
    color: ${token.colorTextSecondary};
  `
}))

const Item = memo(({ id, title, lastActiveAt, sourceMessageId }) => {
  const { t } = useTranslation("chat")
  const openThreadInPortal = useChatStore(s => s.openThreadInPortal)
  const { styles, cx } = useStyles()
  const [isActive, messageCount] = useChatStore(s => [
    s.activeThreadId === id,
    chatSelectors.countMessagesByThreadId(id)(s)
  ])
  return (
      <Flexbox
          align={"baseline"}
          className={cx(styles.container, isActive && styles.active)}
          gap={8}
          horizontal
          onClick={() => {
            if (isActive) return

            openThreadInPortal(id, sourceMessageId)
          }}
      >
        {title}
        <Flexbox className={styles.extra} horizontal>
          {!!messageCount && t("thread.threadMessageCount", { messageCount })}
          { ` · ${dayjs(lastActiveAt).format("YYYY-MM-DD")}`}
          <Icon icon={ChevronRight} />
        </Flexbox>
      </Flexbox>
  )
})

export default Item
