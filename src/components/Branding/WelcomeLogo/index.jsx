"use client"

import { memo } from "react"

import { isCustomBranding } from "@/const/version"

import CustomLogo from "./Custom"
import LobeChat from "./LobeChat"

export const WelcomeLogo = memo(() => {
  if (isCustomBranding) {
    return <CustomLogo  />
  }

  return <LobeChat />
})
