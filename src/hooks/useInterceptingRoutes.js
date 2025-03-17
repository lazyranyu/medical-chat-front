import { useMemo } from "react"
import urlJoin from "url-join"

import { INBOX_SESSION_ID } from "@/const/session"
import { useQueryRoute } from "@/hooks/useQueryRoute"
import { useGlobalStore } from "@/store/global"
import {
  ChatSettingsTabs,
  SettingsTabs,
  SidebarTabKey
} from "@/store/global/initialState"
import { useSessionStore } from "@/store/session"
import {sessionMetaSelectors} from "@/store";

export const useOpenChatSettings = (tab = ChatSettingsTabs.Meta) => {
  const activeId = useSessionStore(sessionMetaSelectors,s => s.activeId)
  const router = useQueryRoute()

  return useMemo(() => {
    if (activeId === INBOX_SESSION_ID) {
      useGlobalStore.setState({
        sidebarKey: SidebarTabKey.Setting
      })
      return () => router.push(urlJoin("/settings", SettingsTabs.Agent))
    }
    // use Intercepting Routes on Desktop
    return () =>
        router.push("/chat/settings/modal", { query: { session: activeId, tab } })
  }, [activeId, router, tab])
}
