import { Icon } from "@lobehub/ui"
import { createStyles } from "antd-style"
import { BookOpenTextIcon, ChevronDown, ChevronRight } from "lucide-react"
import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"

import ChunkItem from "./Item"

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  container: css`
    cursor: pointer;

    padding-block: 8px;
    padding-inline: 12px;
    padding-inline-end: 12px;

    color: ${token.colorText};

    background: ${token.colorFillTertiary};
    border-radius: 8px;

    &:hover {
      background: ${isDarkMode ? "" : token.colorFillSecondary};
    }
  `,
  title: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    font-size: 12px;
    text-overflow: ellipsis;
  `
}))

const FileChunks = memo(({ data }) => {
  const { t } = useTranslation("chat")
  const { styles, theme } = useStyles()

  const [showDetail, setShowDetail] = useState(false)

  return (
      <Flexbox
          className={styles.container}
          gap={16}
          onClick={() => {
            setShowDetail(!showDetail)
          }}
          width={"100%"}
      >
        <Flexbox distribution={"space-between"} flex={1} horizontal>
          <Flexbox gap={8} horizontal>
            <Icon color={theme.geekblue} icon={BookOpenTextIcon} />{" "}
            {t("rag.referenceChunks")}
          </Flexbox>
          <Icon icon={showDetail ? ChevronDown : ChevronRight} />
        </Flexbox>
        {showDetail && (
            <Flexbox gap={8} horizontal wrap={"wrap"}>
              {data.map((item, index) => {
                return <ChunkItem index={index} key={item.id} {...item}></ChunkItem>
              })}
            </Flexbox>
        )}
      </Flexbox>
  )
})

export default FileChunks
