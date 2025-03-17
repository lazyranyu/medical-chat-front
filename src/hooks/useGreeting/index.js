import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { parseGreetingTime } from "./greetingTime"
import welcome from "@/locales/default/welcome";
export const useGreeting = () => {
  const { t } = useTranslation("welcome")

  const [greeting, setGreeting] = useState()

  useEffect(() => {
    setGreeting(parseGreetingTime())
  }, [])

  return greeting && welcome.guide.welcome[greeting]
}
