import isEqual from "fast-deep-equal"
import { t } from "i18next"
import useSWR, { mutate } from "swr"

import { message } from "@/components/AntdStaticMethods"
import { MESSAGE_CANCEL_FLAT } from "@/const/message"
import { DEFAULT_AGENT_LOBE_SESSION, INBOX_SESSION_ID } from "@/const/session"
import { useClientDataSWR } from "@/libs/swr"
import { sessionService} from "@/api/session";
import { useUserStore } from "@/store/user"
import { settingsSelectors } from "@/store/user/selectors"
import { merge } from "@/utils/merge"
import { setNamespace } from "@/utils/storeDebug"

import { sessionsReducer } from "./reducers"
import { sessionSelectors } from "./selectors"
import { sessionMetaSelectors } from "./selectors/meta"

const n = setNamespace("session")

const FETCH_SESSIONS_KEY = "fetchSessions"
const SEARCH_SESSIONS_KEY = "searchSessions"

export const createSessionSlice = (set, get) => ({
  clearSessions: async () => {
    await sessionService.removeAllSessions()
    await get().refreshSessions()
  },

  createSession: async (agent, isSwitchSession = true) => {
    const { switchSession, refreshSessions } = get()

    // merge the defaultAgent in settings
    const defaultAgent = merge(
        DEFAULT_AGENT_LOBE_SESSION,
        // settingsSelectors.defaultAgent(useUserStore.getState())
    )

    const newSession = merge(defaultAgent, agent)

    const id = await sessionService.createSession(
        'agent',
        newSession
    )
    await refreshSessions()

    // Whether to goto  to the new session after creation, the default is to switch to
    if (isSwitchSession) switchSession(id)

    return id
  },
  duplicateSession: async id => {
    const { switchSession, refreshSessions } = get()
    const session = sessionSelectors.getSessionById(id)(get())

    if (!session) return
    const title = sessionMetaSelectors.getTitle(session.meta)

    const newTitle = t("duplicateSession.title", { ns: "chat", title: title })

    const messageLoadingKey = "duplicateSession.loading"

    message.loading({
      content: t("duplicateSession.loading", { ns: "chat" }),
      duration: 0,
      key: messageLoadingKey
    })

    const newId = await sessionService.cloneSession(id, newTitle)

    // duplicate Session Error
    if (!newId) {
      message.destroy(messageLoadingKey)
      message.error(t("copyFail", { ns: "common" }))
      return
    }

    await refreshSessions()
    message.destroy(messageLoadingKey)
    message.success(t("duplicateSession.success", { ns: "chat" }))

    switchSession(newId)
  },
  pinSession: async (id, pinned) => {
    await get().internal_updateSession(id, { pinned })
  },
  removeSession: async sessionId => {
    await sessionService.removeSession(sessionId)
    await get().refreshSessions()

    // If the active session deleted, switch to the inbox session
    if (sessionId === get().activeId) {
      get().switchSession(INBOX_SESSION_ID)
    }
  },

  switchSession: sessionId => {
    if (get().activeId === sessionId) return

    set({ activeId: sessionId }, false, n(`activeSession/${sessionId}`))
  },

  triggerSessionUpdate: async id => {
    await get().internal_updateSession(id, { updatedAt: new Date() })
  },

  updateSearchKeywords: keywords => {
    set(
        { isSearching: !!keywords, sessionSearchKeywords: keywords },
        false,
        n("updateSearchKeywords")
    )
  },
  updateSessionGroupId: async (sessionId, group) => {
    await get().internal_updateSession(sessionId, { group })
  },

  updateSessionMeta: async meta => {
    const session = sessionSelectors.currentSession(get())
    if (!session) return

    const { activeId, refreshSessions } = get()

    const abortController = get().signalSessionMeta
    if (abortController) abortController.abort(MESSAGE_CANCEL_FLAT)
    const controller = new AbortController()
    set({ signalSessionMeta: controller }, false, "updateSessionMetaSignal")

    await sessionService.updateSessionMeta(activeId, meta, controller.signal)
    await refreshSessions()
  },

  useFetchSessions: (enabled, isLogin) =>
      useClientDataSWR(
          enabled ? [FETCH_SESSIONS_KEY, isLogin] : null,
          () => sessionService.getGroupedSessions(),
          {
            fallbackData: {
              sessionGroups: [],
              sessions: []
            },
            onSuccess: data => {
              if (
                  get().isSessionsFirstFetchFinished &&
                  isEqual(get().sessions, data.sessions) &&
                  isEqual(get().sessionGroups, data.sessionGroups)
              )
                return

              get().internal_processSessions(
                  data.sessions,
                  data.sessionGroups,
                  n("useFetchSessions/updateData")
              )
              set(
                  { isSessionsFirstFetchFinished: true },
                  false,
                  n("useFetchSessions/onSuccess", data)
              )
            },
            suspense: true
          }
      ),
  useSearchSessions: keyword =>
      useSWR(
          [SEARCH_SESSIONS_KEY, keyword],
          async () => {
            if (!keyword) return []
            return ;
            return sessionService.searchSessions(keyword)
          },
          { revalidateOnFocus: false, revalidateOnMount: false }
      ),

  /* eslint-disable sort-keys-fix/sort-keys-fix */
  internal_dispatchSessions: payload => {
    const nextSessions = sessionsReducer(get().sessions, payload)
    get().internal_processSessions(nextSessions, get().sessionGroups)
  },
  internal_updateSession: async (id, data) => {
    get().internal_dispatchSessions({ type: "updateSession", id, value: data })

    await sessionService.updateSession(id, data)
    await get().refreshSessions()
  },
  internal_processSessions: (sessions, sessionGroups) => {
    const customGroups = sessionGroups.map(item => ({
      ...item,
      children: sessions.filter(i => i.group === item.id && !i.pinned)
    }))

    const defaultGroup = sessions.filter(
        item => (!item.group || item.group === "default") && !item.pinned
    )
    const pinnedGroup = sessions.filter(item => item.pinned)

    set(
        {
          customSessionGroups: customGroups,
          defaultSessions: defaultGroup,
          pinnedSessions: pinnedGroup,
          sessionGroups,
          sessions
        },
        false,
        n("processSessions")
    )
  },
  refreshSessions: async () => {
    await mutate([FETCH_SESSIONS_KEY, true])
  }
})
