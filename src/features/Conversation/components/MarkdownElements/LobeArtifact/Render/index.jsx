import { Icon } from "@lobehub/ui"
import { App } from "antd"
import { createStyles } from "antd-style"
import { Loader2 } from "lucide-react"
import { memo, useContext, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Center, Flexbox } from "react-layout-kit"

import { useChatStore } from "@/store/chat"
import { chatPortalSelectors, messageSelectors } from "@/store/chat/selectors"
import { dotLoading } from "@/styles/loading"

import { InPortalThreadContext } from "../../../ChatItem/InPortalThreadContext"
import ArtifactIcon from "./Icon"

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  avatar: css`
    background: ${token.colorFillQuaternary};
    border-inline-end: 1px solid ${token.colorSplit};
  `,
  container: css`
    cursor: pointer;

    margin-block-start: 12px;

    color: ${token.colorText};

    border: 1px solid ${token.colorBorder};
    border-radius: 8px;
    box-shadow: ${isDarkMode
        ? token.boxShadowSecondary
        : token.boxShadowTertiary};

    &:hover {
      background: ${token.colorFillQuaternary};
    }
  `,
  desc: css`
    font-size: 12px;
    color: ${token.colorTextTertiary};
  `,
  title: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    text-overflow: ellipsis;
  `
}))

const Render = memo(({ identifier, title, type, language, children, id }) => {
  const { t } = useTranslation("chat")
  const { styles, cx } = useStyles()

  const hasChildren = !!children
  const str = (children || "").toString?.()

  const inThread = useContext(InPortalThreadContext)
  const { message } = App.useApp()
  const [
    isGenerating,
    isArtifactTagClosed,
    currentArtifactMessageId,
    openArtifact,
    closeArtifact
  ] = useChatStore(s => {
    return [
      messageSelectors.isMessageGenerating(id)(s),
      chatPortalSelectors.isArtifactTagClosed(id)(s),
      chatPortalSelectors.artifactMessageId(s),
      s.openArtifact,
      s.closeArtifact
    ]
  })

  const openArtifactUI = () => {
    openArtifact({ id, identifier, language, title, type })
  }

  useEffect(() => {
    if (!hasChildren || !isGenerating) return

    openArtifactUI()
  }, [isGenerating, hasChildren, str, identifier, title, type, id, language])

  return (
      <p>
        <Flexbox
            className={styles.container}
            gap={16}
            onClick={() => {
              if (currentArtifactMessageId === id) {
                closeArtifact()
              } else {
                if (inThread) {
                  message.info(t("artifact.inThread"))
                  return
                }
                openArtifactUI()
              }
            }}
            width={"100%"}
        >
          <Flexbox align={"center"} flex={1} horizontal>
            <Center className={styles.avatar} height={64} horizontal width={64}>
              <ArtifactIcon type={type} />
            </Center>
            <Flexbox gap={4} paddingBlock={8} paddingInline={12}>
              {!title && isGenerating ? (
                  <Flexbox className={cx(dotLoading)} horizontal>
                    {t("artifact.generating")}
                  </Flexbox>
              ) : (
                  <Flexbox className={cx(styles.title)}>
                    {title || t("artifact.unknownTitle")}
                  </Flexbox>
              )}
              {hasChildren && (
                  <Flexbox className={styles.desc} horizontal>
                    {identifier} ·{" "}
                    <Flexbox gap={2} horizontal>
                      {!isArtifactTagClosed && (
                          <div>
                            <Icon icon={Loader2} spin />
                          </div>
                      )}
                      {str?.length}
                    </Flexbox>
                  </Flexbox>
              )}
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </p>
  )
})

export default Render
