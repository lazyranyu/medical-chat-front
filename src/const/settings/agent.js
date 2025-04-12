import { DEFAULT_AGENT_META } from "@/const/meta"
import { DEFAULT_MODEL } from "@/const/settings/llm"

export const DEFAUTT_AGENT_TTS_CONFIG = {
  showAllLocaleVoice: false,
  sttLocale: "auto",
  ttsService: "openai",
  voice: {
    openai: "alloy"
  }
}

export const DEFAULT_AGENT_CHAT_CONFIG = {
  autoCreateTopicThreshold: 2,
  displayMode: "chat",
  enableAutoCreateTopic: true,
  enableCompressHistory: true,
  enableHistoryCount: true,
  historyCount: 8
}

export const DEFAULT_AGENT_CONFIG = {
  chatConfig: DEFAULT_AGENT_CHAT_CONFIG,
  model: DEFAULT_MODEL,
  params: {
    frequency_penalty: 0,
    presence_penalty: 0,
    temperature: 1,
    top_p: 1
  },
  plugins: [],
  provider: 'openai',
  systemRole: "",
  tts: DEFAUTT_AGENT_TTS_CONFIG
}

export const DEFAULT_AGENT = {
  config: DEFAULT_AGENT_CONFIG,
  meta: DEFAULT_AGENT_META
}
