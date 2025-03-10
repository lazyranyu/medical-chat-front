import { AssistantActionsBar } from "./Assistant"
import { DefaultActionsBar } from "./Fallback"
import { ToolActionsBar } from "./Tool"
import { UserActionsBar } from "./User"

export const renderActions = {
  assistant: AssistantActionsBar,
  system: DefaultActionsBar,
  tool: ToolActionsBar,
  user: UserActionsBar
}
