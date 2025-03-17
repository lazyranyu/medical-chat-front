export const LOBE_CHAT_TRACE_HEADER = "X-lobe-trace"
export const LOBE_CHAT_TRACE_ID = "X-lobe-chat-trace-id"
export const LOBE_CHAT_OBSERVATION_ID = "X-lobe-observation-id"

export let TraceNameMap

;(function(TraceNameMap) {
  TraceNameMap["ConnectivityChecker"] = "Connectivity Checker"
  TraceNameMap["Conversation"] = "Conversation"
  TraceNameMap["EmojiPicker"] = "Emoji Picker"
  TraceNameMap["FetchPluginAPI"] = "Fetch Plugin API"
  TraceNameMap["InvokePlugin"] = "Invoke Plugin"
  TraceNameMap["LanguageDetect"] = "Language Detect"
  TraceNameMap["SummaryAgentDescription"] = "Summary Agent Description"
  TraceNameMap["SummaryAgentTags"] = "Summary Agent Tags"
  TraceNameMap["SummaryAgentTitle"] = "Summary Agent Title"
  TraceNameMap["SummaryTopicTitle"] = "Summary Topic Title"
  TraceNameMap["Translator"] = "Translator"
  TraceNameMap["UserEvents"] = "User Events"
})(TraceNameMap || (TraceNameMap = {}))

export let TraceEventType

;(function(TraceEventType) {
  TraceEventType["CopyMessage"] = "Copy Message"
  TraceEventType["DeleteAndRegenerateMessage"] = "Delete And Regenerate Message"
  TraceEventType["ModifyMessage"] = "Modify Message"
  TraceEventType["RegenerateMessage"] = "Regenerate Message"
})(TraceEventType || (TraceEventType = {}))

export let TraceTopicType

;(function(TraceTopicType) {
  TraceTopicType["AgentSettings"] = "Agent Settings"
})(TraceTopicType || (TraceTopicType = {}))

export let TraceTagMap

;(function(TraceTagMap) {
  TraceTagMap["Chat"] = "Chat Competition"
  TraceTagMap["SystemChain"] = "System Chain"
  TraceTagMap["ToolCalling"] = "Tool Calling"
  TraceTagMap["ToolsCall"] = "Tools Call"
})(TraceTagMap || (TraceTagMap = {}))
