import dayjs from "dayjs"

import { COOKIE_CACHE_DAYS } from "@/const/settings"

export const setCookie = (key, value) => {
  const expires = dayjs()
      .add(COOKIE_CACHE_DAYS, "day")
      .toISOString()

  document.cookie = `${key}=${value};expires=${expires};path=/;`
}
