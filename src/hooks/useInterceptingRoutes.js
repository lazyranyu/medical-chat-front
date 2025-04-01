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

export const useOpenChatSettings = (tab = ChatSettingsTabs.Meta) => {
  const router = useQueryRoute()

  return useMemo(() => {
    useGlobalStore.setState({
      sidebarKey: SidebarTabKey.Setting
    })
    return () => router.push(urlJoin("/settings", SettingsTabs.Agent))
  }, [ router, tab])
}
