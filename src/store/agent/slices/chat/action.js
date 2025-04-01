import isEqual from "fast-deep-equal"
import { produce } from "immer"
import { mutate } from "swr"

import { MESSAGE_CANCEL_FLAT } from "@/const/message"
import { INBOX_SESSION_ID } from "@/const/session"
import { DEFAULT_AGENT_CONFIG } from "@/const/settings"
import { useClientDataSWR, useOnlyFetchOnceSWR } from "@/libs/swr"
// import { agentService } from "@/services/agent"
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
  updateAgentConfig: async config => {
    const { activeId } = get()

    if (!activeId) return

    const controller = get().internal_createAbortController(
        "updateAgentConfigSignal"
    )

    await get().internal_updateAgentConfig(activeId, config, controller.signal)
  },
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

    await get().internal_refreshAgentConfig(id)
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
