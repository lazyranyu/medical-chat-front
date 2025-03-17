import { t } from "i18next"

import {
  DEFAULT_AVATAR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_INBOX_AVATAR
} from "@/const/meta"
import { merge } from "@/utils/merge"

import { sessionSelectors } from "./list"

// ==========   Meta   ============== //
const currentAgentMeta = s => {
  const isInbox = sessionSelectors.isInboxSession(s)

  const defaultMeta = {
    avatar: isInbox ? DEFAULT_INBOX_AVATAR : DEFAULT_AVATAR,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    description: isInbox ? t("inbox.desc", { ns: "chat" }) : undefined,
    title: isInbox ? t("inbox.title", { ns: "chat" }) : t("defaultSession")
  }

  const session = sessionSelectors.currentSession(s)

  return merge(defaultMeta, session?.meta)
}

const currentAgentTitle = s => currentAgentMeta(s).title
const currentAgentDescription = s => currentAgentMeta(s).description
const currentAgentAvatar = s => currentAgentMeta(s).avatar
const currentAgentBackgroundColor = s => currentAgentMeta(s).backgroundColor

const getAvatar = s => s.avatar || DEFAULT_AVATAR
const getTitle = s => s.title || t("defaultSession", { ns: "common" })
// New session do not show 'noDescription'
export const getDescription = s => s.description

export const sessionMetaSelectors = {
  currentAgentAvatar,
  currentAgentBackgroundColor,
  currentAgentDescription,
  currentAgentMeta,
  currentAgentTitle,
  getAvatar,
  getDescription,
  getTitle
}
