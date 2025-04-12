import { DEFAULT_AGENT_META } from "@/const/meta"
import {
  DEFAULT_AGENT,
  DEFAULT_AGENT_CONFIG,
  DEFAULT_SYSTEM_AGENT_CONFIG,
  DEFAULT_TTS_CONFIG
} from "@/const/settings"
import { merge } from "@/utils/merge"

export const currentSettings = s => merge(s.defaultSettings, s.settings)

export const currentLLMSettings = s => currentSettings(s).languageModel || {}

export const getProviderConfigById = provider => s =>
    currentLLMSettings(s)[provider]

const currentTTS = s => merge(DEFAULT_TTS_CONFIG, currentSettings(s).tts)

const defaultAgent = s => merge(DEFAULT_AGENT, currentSettings(s).defaultAgent)
const defaultAgentConfig = s =>
    merge(DEFAULT_AGENT_CONFIG, defaultAgent(s).config)

const defaultAgentMeta = s => merge(DEFAULT_AGENT_META, defaultAgent(s).meta)

const exportSettings = currentSettings

const dalleConfig = s => currentSettings(s).tool?.dalle || {}
const isDalleAutoGenerating = s => currentSettings(s).tool?.dalle?.autoGenerate

const currentSystemAgent = s =>
    merge(DEFAULT_SYSTEM_AGENT_CONFIG, currentSettings(s).systemAgent)

export const settingsSelectors = {
  currentSettings,
  currentSystemAgent,
  currentTTS,
  dalleConfig,
  defaultAgent,
  defaultAgentConfig,
  defaultAgentMeta,
  exportSettings,
  isDalleAutoGenerating,
  providerConfig: getProviderConfigById
}
