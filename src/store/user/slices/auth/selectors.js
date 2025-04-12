import { t } from "i18next"

import { enableClerk } from "@/const/auth"
import { BRANDING_NAME } from "@/const/branding"

const DEFAULT_USERNAME = BRANDING_NAME

const nickName = s => {
  if (!s.enableAuth()) return t("userPanel.defaultNickname", { ns: "common" })

  if (s.isSignedIn) return s.user?.fullName || s.user?.username

  return t("userPanel.anonymousNickName", { ns: "common" })
}

const username = s => {
  if (!s.enableAuth()) return DEFAULT_USERNAME

  if (s.isSignedIn) return s.user?.username

  return "anonymous"
}

export const userProfileSelectors = {
  nickName,
  userAvatar: s => s.user?.avatar || "",
  userId: s => s.user?.id,
  userProfile: s => s.user,
  username
}

/**
 * 使用此方法可以兼容不需要登录鉴权的情况
 */
const isLogin = s => {
  // 如果没有开启鉴权，说明不需要登录，默认是登录态
  if (!s.enableAuth()) return true

  return s.isSignedIn
}

export const authSelectors = {
  enabledAuth: s => s.enableAuth(),
  enabledNextAuth: s => !!s.enabledNextAuth,
  isLoaded: s => s.isLoaded,
  isLogin,
  isLoginWithAuth: s => s.isSignedIn,
  isLoginWithClerk: s => (s.isSignedIn && enableClerk) || false,
  isLoginWithNextAuth: s => (s.isSignedIn && !!s.enabledNextAuth) || false
}
