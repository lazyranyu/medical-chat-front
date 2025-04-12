import { DEFAULT_LANG } from "@/const/locale"
import { isOnServerSide } from "@/utils/env"

import { currentSettings } from "./settings"

const generalConfig = s => currentSettings(s).general || {}

const currentLanguage = s => {
  const locale = generalConfig(s).language

  if (locale === "auto") {
    if (isOnServerSide) return DEFAULT_LANG

    return navigator.language
  }

  return locale
}

const currentThemeMode = s => {
  const themeMode = generalConfig(s).themeMode
  return themeMode || "auto"
}

const neutralColor = s => generalConfig(s).neutralColor
const primaryColor = s => generalConfig(s).primaryColor
const fontSize = s => generalConfig(s).fontSize
const language = s => generalConfig(s).language

export const userGeneralSettingsSelectors = {
  config: generalConfig,
  currentLanguage,
  currentThemeMode,
  fontSize,
  language,
  neutralColor,
  primaryColor
}
