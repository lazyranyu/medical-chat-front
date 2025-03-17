
import {DEFAULT_LLM_CONFIG, DEFAULT_MODEL} from './llm';
export * from './llm';
export const DEFAULT_REWRITE_QUERY =
    'Given the following conversation and a follow-up question, rephrase the follow up question to be a standalone question, in its original language. Keep as much details as possible from previous messages. Keep entity names and all.';

export const DEFAUTT_AGENT_TTS_CONFIG = {
    showAllLocaleVoice: false,
    sttLocale: "auto",
    ttsService: "openai",
    voice: {
        openai: "alloy"
    }
}

export const DEFAULT_AGENT_CHAT_CONFIG= {
    autoCreateTopicThreshold: 2,
    displayMode: 'chat',
    enableAutoCreateTopic: true,
    enableCompressHistory: true,
    enableHistoryCount: true,
    historyCount: 8,
};
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

export const COOKIE_CACHE_DAYS = 30;