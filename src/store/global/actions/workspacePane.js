import { produce } from "immer"

import { INBOX_SESSION_ID } from "@/const/session"
import { SESSION_CHAT_URL } from "@/const/url"
import { setNamespace } from "@/utils/storeDebug"

const n = setNamespace("w")

export const globalWorkspaceSlice = (set, get) => ({
  switchBackToChat: sessionId => {
    get().router?.push(
        SESSION_CHAT_URL(sessionId || INBOX_SESSION_ID, get().isMobile)
    )
  },

  toggleChatSideBar: newValue => {
    const showChatSideBar =
        typeof newValue === "boolean" ? newValue : !get().status.showChatSideBar

    get().updateSystemStatus(
        { showChatSideBar },
        n("toggleAgentPanel", newValue)
    )
  },
  toggleExpandSessionGroup: (id, expand) => {
    const { status } = get()
    const nextExpandSessionGroup = produce(
        status.expandSessionGroupKeys,
        draft => {
          if (expand) {
            if (draft.includes(id)) return
            draft.push(id)
          } else {
            const index = draft.indexOf(id)
            if (index !== -1) draft.splice(index, 1)
          }
        }
    )
    get().updateSystemStatus({ expandSessionGroupKeys: nextExpandSessionGroup })
  },
  toggleMobilePortal: newValue => {
    const mobileShowPortal =
        typeof newValue === "boolean" ? newValue : !get().status.mobileShowPortal

    get().updateSystemStatus(
        { mobileShowPortal },
        n("toggleMobilePortal", newValue)
    )
  },
  toggleMobileTopic: newValue => {
    const mobileShowTopic =
        typeof newValue === "boolean" ? newValue : !get().status.mobileShowTopic

    get().updateSystemStatus(
        { mobileShowTopic },
        n("toggleMobileTopic", newValue)
    )
  },
  toggleSystemRole: newValue => {
    const showSystemRole =
        typeof newValue === "boolean" ? newValue : !get().status.mobileShowTopic

    get().updateSystemStatus(
        { showSystemRole },
        n("toggleMobileTopic", newValue)
    )
  },
  toggleZenMode: () => {
    const { status } = get()
    const nextZenMode = !status.zenMode

    get().updateSystemStatus({ zenMode: nextZenMode }, n("toggleZenMode"))
  }
})
