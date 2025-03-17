"use client"

import { ActionIcon } from "@lobehub/ui"
import { createStyles } from "antd-style"
import { shuffle } from "lodash-es"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"
import React from "react"

import { BRANDING_NAME } from "@/const/branding"
import { USAGE_DOCUMENTS } from "@/const/url"
import { useSendMessage } from "@/features/ChatInput/useSend"
import { useChatStore } from "@/store/chat"
import welcome from "@/locales/default/welcome";

const useStyles = createStyles(({ css, token, responsive }) => ({
  card: css`
    cursor: pointer;

    padding-block: 12px;
    padding-inline: 24px;

    color: ${token.colorText};

    background: ${token.colorBgContainer};
    border-radius: 48px;

    &:hover {
      background: ${token.colorBgElevated};
    }

    ${responsive.mobile} {
      padding-block: 8px;
      padding-inline: 16px;
    }
  `,
  icon: css`
    color: ${token.colorTextSecondary};
  `,
  title: css`
    color: ${token.colorTextDescription};
  `
}))

const qaItems = [
  "q01",
  "q02",
  "q03",
  "q04",
  "q05",
  "q06",
  "q07",
  "q08",
  "q09",
  "q10",
  "q11",
  "q12",
  "q13",
  "q14",
  "q15"
]

const QuestionSuggest = memo(({ mobile }) => {
  const [updateInputMessage] = useChatStore(s => [s.updateInputMessage])

  const { styles } = useStyles()
  const { send: sendMessage } = useSendMessage()
  
  // 修改为使用useEffect确保只在客户端执行随机排序
  const [qa, setQa] = React.useState(qaItems);
  
  React.useEffect(() => {
    // 只在客户端执行随机排序
    setQa(shuffle([...qaItems]));
  }, []);

  return (
      <Flexbox gap={8} width={"100%"}>
        <Flexbox align={"center"} horizontal justify={"space-between"}>
          <div className={styles.title}>{welcome.guide.questions.title}</div>
          <Link href={USAGE_DOCUMENTS} target={"_blank"}>
            <ActionIcon
                icon={ArrowRight}
                size={{ blockSize: 24, fontSize: 16 }}
                title={welcome.guide.questions.moreBtn}
            />
          </Link>
        </Flexbox>
        <Flexbox gap={8} horizontal wrap={"wrap"}>
          {qa.slice(0, 5).map(item => {
            const text = welcome.guide.qa[item].replace(/appName/g,BRANDING_NAME)
            return (
                <Flexbox
                    align={"center"}
                    className={styles.card}
                    gap={8}
                    horizontal
                    key={item}
                    onClick={() => {
                      updateInputMessage(text)
                      sendMessage({ isWelcomeQuestion: true })
                    }}
                >
                  {text}
                </Flexbox>
            )
          })}
        </Flexbox>
      </Flexbox>
  )
})

export default QuestionSuggest
