import { DEFAULT_LANG } from "@/const/locale"
import { isOnServerSide } from "@/utils/env"

import { systemStatus } from "./systemStatus"

const language = s => systemStatus(s).language || "auto"

const currentLanguage = s => {
  const locale = language(s)

  if (locale === "auto") {
    if (isOnServerSide) return DEFAULT_LANG

    return navigator.language
  }

  return locale
}

export const globalGeneralSelectors = {
  currentLanguage,
  language
}
