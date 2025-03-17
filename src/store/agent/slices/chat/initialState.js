import { DEFAULT_AGENT_CONFIG } from "@/const/settings"

export const initialAgentChatState = {
  activeId: "inbox",
  agentMap: {},
  defaultAgentConfig: DEFAULT_AGENT_CONFIG,
  isInboxAgentConfigInit: false
}
