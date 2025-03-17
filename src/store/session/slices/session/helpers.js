import { t } from "i18next"

import { DEFAULT_AVATAR } from "@/const/meta"
import { DEFAULT_AGENT_LOBE_SESSION } from "@/const/session"

export const getSessionPinned = session => session.pinned

const getAvatar = s => s.avatar || DEFAULT_AVATAR
const getTitle = s => s.title || t("defaultSession", { ns: "common" })

const getSessionById = (id, sessions) => {
  const session = sessions.find(s => s.id === id)

  if (!session) return DEFAULT_AGENT_LOBE_SESSION

  return session
}

export const sessionHelpers = {
  getAvatar,
  getSessionById,
  getSessionPinned,
  getTitle
}
