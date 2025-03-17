import { css, cx } from "antd-style"
import { LanguagesIcon } from "lucide-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { localeOptions } from "@/locales/resources"
import common from "@/locales/default/common";
import chat from "@/locales/default/chat";
const translateStyle = css`
  .ant-dropdown-menu-sub {
    overflow-y: scroll;
    max-height: 400px;
  }
`

export const useCustomActions = () => {

  const translate = {
    children: localeOptions.map(i => ({
      key: i.value,
      label:
          common.lang[i.value]
    })),

    icon: LanguagesIcon,
    key: "translate",
    label: chat.translate.action,
    popupClassName: cx(translateStyle)
  }

  return useMemo(() => ({ translate }), [])
}
