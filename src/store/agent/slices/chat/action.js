import isEqual from "fast-deep-equal"
import { produce } from "immer"
import { mutate } from "swr"

import { MESSAGE_CANCEL_FLAT } from "@/const/message"
import { INBOX_SESSION_ID } from "@/const/session"
import { DEFAULT_AGENT_CONFIG } from "@/const/settings"
import { useClientDataSWR, useOnlyFetchOnceSWR } from "@/libs/swr"
// import { agentService } from "@/services/agent"
import { sessionService} from "@/api/session";
import { useSessionStore } from "@/store/session"
import { merge } from "@/utils/merge"

import { agentSelectors } from "./selectors"

const FETCH_AGENT_CONFIG_KEY = "FETCH_AGENT_CONFIG"
const FETCH_AGENT_KNOWLEDGE_KEY = "FETCH_AGENT_KNOWLEDGE"

export const createChatSlice = (set, get) => ({
  addFilesToAgent: async (fileIds, enabled) => {
    const {
      activeAgentId,
      internal_refreshAgentConfig,
      internal_refreshAgentKnowledge
    } = get()
    if (!activeAgentId) return
    if (fileIds.length === 0) return

    // await agentService.createAgentFiles(activeAgentId, fileIds, enabled)
    await internal_refreshAgentConfig(get().activeId)
    await internal_refreshAgentKnowledge()
  },
  addKnowledgeBaseToAgent: async knowledgeBaseId => {
    const {
      activeAgentId,
      internal_refreshAgentConfig,
      internal_refreshAgentKnowledge
    } = get()
    if (!activeAgentId) return

    // await agentService.createAgentKnowledgeBase(
    //     activeAgentId,
    //     knowledgeBaseId,
    //     true
    // )
    await internal_refreshAgentConfig(get().activeId)
    await internal_refreshAgentKnowledge()
  },
  removeFileFromAgent: async fileId => {
    const {
      activeAgentId,
      internal_refreshAgentConfig,
      internal_refreshAgentKnowledge
    } = get()
    if (!activeAgentId) return

    // await agentService.deleteAgentFile(activeAgentId, fileId)
    await internal_refreshAgentConfig(get().activeId)
    await internal_refreshAgentKnowledge()
  },
  removeKnowledgeBaseFromAgent: async knowledgeBaseId => {
    const {
      activeAgentId,
      internal_refreshAgentConfig,
      internal_refreshAgentKnowledge
    } = get()
    if (!activeAgentId) return

    // await agentService.deleteAgentKnowledgeBase(activeAgentId, knowledgeBaseId)
    await internal_refreshAgentConfig(get().activeId)
    await internal_refreshAgentKnowledge()
  },

  removePlugin: async id => {
    await get().togglePlugin(id, false)
  },
  toggleFile: async (id, open) => {
    const { activeAgentId, internal_refreshAgentConfig } = get()
    if (!activeAgentId) return

    // await agentService.toggleFile(activeAgentId, id, open)

    await internal_refreshAgentConfig(get().activeId)
  },
  toggleKnowledgeBase: async (id, open) => {
    const { activeAgentId, internal_refreshAgentConfig } = get()
    if (!activeAgentId) return

    // await agentService.toggleKnowledgeBase(activeAgentId, id, open)

    await internal_refreshAgentConfig(get().activeId)
  },
  togglePlugin: async (id, open) => {
    const originConfig = agentSelectors.currentAgentConfig(get())

    const config = produce(originConfig, draft => {
      draft.plugins = produce(draft.plugins || [], plugins => {
        const index = plugins.indexOf(id)
        const shouldOpen = open !== undefined ? open : index === -1

        if (shouldOpen) {
          // 如果 open 为 true 或者 id 不存在于 plugins 中，则添加它
          if (index === -1) {
            plugins.push(id)
          }
        } else {
          // 如果 open 为 false 或者 id 存在于 plugins 中，则移除它
          if (index !== -1) {
            plugins.splice(index, 1)
          }
        }
      })
    })

    await get().updateAgentConfig(config)
  },
  updateAgentChatConfig: async config => {
    const { activeId } = get()

    if (!activeId) return

    await get().updateAgentConfig({ chatConfig: config })
  },
  updateAgentConfig: async config => {
    const { activeId } = get()

    if (!activeId) return

    const controller = get().internal_createAbortController(
        "updateAgentConfigSignal"
    )

    await get().internal_updateAgentConfig(activeId, config, controller.signal)
  },
  useFetchAgentConfig: sessionId =>
      useClientDataSWR(
          [FETCH_AGENT_CONFIG_KEY, sessionId],
          ([, id]) => sessionService.getSessionConfig(id),
          {
            fallbackData: DEFAULT_AGENT_CONFIG,
            onSuccess: data => {
              get().internal_dispatchAgentMap(sessionId, data, "fetch")
              set({ activeAgentId: data.id }, false, "updateActiveAgentId")
            },
            suspense: true
          }
      ),
  useFetchFilesAndKnowledgeBases: () => {
    return useClientDataSWR(
        [FETCH_AGENT_KNOWLEDGE_KEY, get().activeAgentId],
        // ([, id]) => agentService.getFilesAndKnowledgeBases(id),
        {
          fallbackData: [],
          suspense: true
        }
    )
  },

  useInitAgentStore: (isLogin, defaultAgentConfig) =>
      useOnlyFetchOnceSWR(
          !!isLogin ? "fetchInboxAgentConfig" : null,
          () => sessionService.getSessionConfig(INBOX_SESSION_ID),
          {
            onSuccess: data => {
              set(
                  {
                    defaultAgentConfig: merge(
                        get().defaultAgentConfig,
                        defaultAgentConfig
                    ),
                    isInboxAgentConfigInit: true
                  },
                  false,
                  "initDefaultAgent"
              )

              if (data) {
                get().internal_dispatchAgentMap(INBOX_SESSION_ID, data, "initInbox")
              }
            }
          }
      ),
  /* eslint-disable sort-keys-fix/sort-keys-fix */

  internal_dispatchAgentMap: (id, config, actions) => {
    const agentMap = produce(get().agentMap, draft => {
      if (!draft[id]) {
        draft[id] = config
      } else {
        draft[id] = merge(draft[id], config)
      }
    })

    if (isEqual(get().agentMap, agentMap)) return

    set({ agentMap }, false, "dispatchAgent" + (actions ? `/${actions}` : ""))
  },

  internal_updateAgentConfig: async (id, data, signal) => {
    const prevModel = agentSelectors.currentAgentModel(get())
    // optimistic update at frontend
    get().internal_dispatchAgentMap(id, data, "optimistic_updateAgentConfig")

    await sessionService.updateSessionConfig(id, data, signal)
    await get().internal_refreshAgentConfig(id)

    // refresh sessions to update the agent config if the model has changed
    if (prevModel !== data.model)
      await useSessionStore.getState().refreshSessions()
  },

  internal_refreshAgentConfig: async id => {
    await mutate([FETCH_AGENT_CONFIG_KEY, id])
  },

  internal_refreshAgentKnowledge: async () => {
    await mutate([FETCH_AGENT_KNOWLEDGE_KEY, get().activeAgentId])
  },
  internal_createAbortController: key => {
    const abortController = get()[key]
    if (abortController) abortController.abort(MESSAGE_CANCEL_FLAT)
    const controller = new AbortController()
    set({ [key]: controller }, false, "internal_createAbortController")

    return controller
  }
})
