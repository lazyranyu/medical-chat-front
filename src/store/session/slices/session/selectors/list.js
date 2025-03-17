import { DEFAULT_AGENT_LOBE_SESSION, INBOX_SESSION_ID } from "@/const/session"
import { sessionHelpers } from "@/store/session/slices/session/helpers"

const defaultSessions = s => s.defaultSessions
const pinnedSessions = s => s.pinnedSessions
const customSessionGroups = s => s.customSessionGroups

const allSessions = s => s.sessions

const getSessionById = id => s =>
    sessionHelpers.getSessionById(id, allSessions(s))

const getSessionMetaById = id => s => {
  const session = getSessionById(id)(s)

  if (!session) return {}
  return session.meta
}

const currentSession = s => {
  if (!s.activeId) return

  return allSessions(s).find(i => i.id === s.activeId)
}

const currentSessionSafe = s => {
  return currentSession(s) || DEFAULT_AGENT_LOBE_SESSION
}

const hasCustomAgents = s => defaultSessions(s).length > 0

const isInboxSession = s => s.activeId === INBOX_SESSION_ID

const isSessionListInit = s => s.isSessionsFirstFetchFinished

// use to judge whether a session is fully activated
const isSomeSessionActive = s => !!s.activeId && isSessionListInit(s)

export const sessionSelectors = {
  currentSession,
  currentSessionSafe,
  customSessionGroups,
  defaultSessions,
  getSessionById,
  getSessionMetaById,
  hasCustomAgents,
  isInboxSession,
  isSessionListInit,
  isSomeSessionActive,
  pinnedSessions
}
