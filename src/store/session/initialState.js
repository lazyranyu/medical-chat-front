import { initialSessionState } from "./slices/session/initialState"
import { initSessionGroupState } from "./slices/sessionGroup/initialState"

export const initialState = {
  ...initSessionGroupState,
  ...initialSessionState
}
