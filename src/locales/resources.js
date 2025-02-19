export const locales = [
  "ar",
  "bg-BG",
  "de-DE",
  "en-US",
  "es-ES",
  "fr-FR",
  "ja-JP",
  "ko-KR",
  "pt-BR",
  "ru-RU",
  "tr-TR",
  "zh-CN",
  "zh-TW",
  "vi-VN"
]

export const normalizeLocale = locale => {
  if (!locale) return "zh-CN"

  if (locale.startsWith("ar")) return "ar"

  if (locale.startsWith("cn")) return "zh-CN"

  for (const l of locales) {
    if (l.startsWith(locale)) {
      return l
    }
  }

  return "en-US"
}

export const localeOptions = [
  {
    label: "English",
    value: "en-US"
  },
  {
    label: "简体中文",
    value: "zh-CN"
  },
  {
    label: "繁體中文",
    value: "zh-TW"
  },
  {
    label: "日本語",
    value: "ja-JP"
  },
  {
    label: "한국어",
    value: "ko-KR"
  },
  {
    label: "Deutsch",
    value: "de-DE"
  },
  {
    label: "Español",
    value: "es-ES"
  },
  {
    label: "العربية",
    value: "ar"
  },
  {
    label: "Français",
    value: "fr-FR"
  },
  {
    label: "Português",
    value: "pt-BR"
  },
  {
    label: "Русский",
    value: "ru-RU"
  },
  {
    label: "Türkçe",
    value: "tr-TR"
  },
  {
    label: "Polski",
    value: "pl-PL"
  },
  {
    label: "Nederlands",
    value: "nl-NL"
  },
  {
    label: "Italiano",
    value: "it-IT"
  },
  {
    label: "Tiếng Việt",
    value: "vi-VN"
  },
  {
    label: "Български",
    value: "bg-BG"
  }
]

export const supportLocales = [...locales, "en", "zh"]
