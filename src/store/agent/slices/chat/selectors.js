import { VoiceList } from "@lobehub/tts"

import { INBOX_SESSION_ID } from "@/const/session"
import {
  DEFAULT_AGENT_CONFIG,
  DEFAULT_MODEL,
  DEFAULT_PROVIDER,
  DEFAUTT_AGENT_TTS_CONFIG
} from "@/const/settings"
import { KnowledgeType } from "@/types/knowledgeBase"
import { merge } from "@/utils/merge"

const isInboxSession = s => s.activeId === INBOX_SESSION_ID

// ==========   Config   ============== //

const inboxAgentConfig = s =>
    merge(DEFAULT_AGENT_CONFIG, s.agentMap[INBOX_SESSION_ID])
const inboxAgentModel = s => inboxAgentConfig(s).model

const getAgentConfigById = id => s =>
    merge(s.defaultAgentConfig, s.agentMap[id])

const currentAgentConfig = s => getAgentConfigById(s.activeId)(s)

const currentAgentChatConfig = s => currentAgentConfig(s).chatConfig || {}

const currentAgentSystemRole = s => {
  return currentAgentConfig(s).systemRole
}

const currentAgentModel = s => {
  const config = currentAgentConfig(s)

  return config?.model || DEFAULT_MODEL
}

const currentAgentModelProvider = s => {
  const config = currentAgentConfig(s)

  return config?.provider || DEFAULT_PROVIDER
}

const currentAgentPlugins = s => {
  const config = currentAgentConfig(s)

  return config?.plugins || []
}

const currentAgentKnowledgeBases = s => {
  const config = currentAgentConfig(s)

  return config?.knowledgeBases || []
}

const currentAgentFiles = s => {
  const config = currentAgentConfig(s)

  return config?.files || []
}

const currentAgentTTS = s => {
  const config = currentAgentConfig(s)

  return config?.tts || DEFAUTT_AGENT_TTS_CONFIG
}

const currentAgentTTSVoice = lang => s => {
  const { voice, ttsService } = currentAgentTTS(s)
  const voiceList = new VoiceList(lang)
  let currentVoice
  switch (ttsService) {
    case "openai": {
      currentVoice = voice.openai || VoiceList.openaiVoiceOptions?.[0].value
      break
    }
    case "edge": {
      currentVoice = voice.edge || voiceList.edgeVoiceOptions?.[0].value
      break
    }
    case "microsoft": {
      currentVoice =
          voice.microsoft || voiceList.microsoftVoiceOptions?.[0].value
      break
    }
  }
  return currentVoice || "alloy"
}

const currentEnabledKnowledge = s => {
  const knowledgeBases = currentAgentKnowledgeBases(s)
  const files = currentAgentFiles(s)

  return [
    ...files
        .filter(f => f.enabled)
        .map(f => ({
          fileType: f.type,
          id: f.id,
          name: f.name,
          type: KnowledgeType.File
        })),
    ...knowledgeBases
        .filter(k => k.enabled)
        .map(k => ({ id: k.id, name: k.name, type: KnowledgeType.KnowledgeBase }))
  ]
}

const hasSystemRole = s => {
  const config = currentAgentConfig(s)

  return !!config.systemRole
}

const hasKnowledgeBases = s => {
  const knowledgeBases = currentAgentKnowledgeBases(s)

  return knowledgeBases.length > 0
}

const hasFiles = s => {
  const files = currentAgentFiles(s)

  return files.length > 0
}

const hasKnowledge = s => hasKnowledgeBases(s) || hasFiles(s)
const hasEnabledKnowledge = s => currentEnabledKnowledge(s).length > 0
const currentKnowledgeIds = s => {
  return {
    fileIds: currentAgentFiles(s)
        .filter(item => item.enabled)
        .map(f => f.id),
    knowledgeBaseIds: currentAgentKnowledgeBases(s)
        .filter(item => item.enabled)
        .map(k => k.id)
  }
}

export const agentSelectors = {
  currentAgentChatConfig,
  currentAgentConfig,
  currentAgentFiles,
  currentAgentKnowledgeBases,
  currentAgentModel,
  currentAgentModelProvider,
  currentAgentPlugins,
  currentAgentSystemRole,
  currentAgentTTS,
  currentAgentTTSVoice,
  currentEnabledKnowledge,
  currentKnowledgeIds,
  getAgentConfigById,
  hasEnabledKnowledge,
  hasKnowledge,
  hasSystemRole,
  inboxAgentConfig,
  inboxAgentModel,
  isInboxSession
}
