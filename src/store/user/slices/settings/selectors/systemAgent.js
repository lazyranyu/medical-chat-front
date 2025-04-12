import { DEFAULT_SYSTEM_AGENT_CONFIG } from "@/const/settings"
import { merge } from "@/utils/merge"

import { currentSettings } from "./settings"

const currentSystemAgent = s =>
    merge(DEFAULT_SYSTEM_AGENT_CONFIG, currentSettings(s).systemAgent)

const translation = s => currentSystemAgent(s).translation
const topic = s => currentSystemAgent(s).topic
const thread = s => currentSystemAgent(s).thread
const agentMeta = s => currentSystemAgent(s).agentMeta
const queryRewrite = s => currentSystemAgent(s).queryRewrite
const historyCompress = s => currentSystemAgent(s).historyCompress

export const systemAgentSelectors = {
  agentMeta,
  historyCompress,
  queryRewrite,
  thread,
  topic,
  translation
}
