import { initialAuthState } from "./slices/auth/initialState"
import { initialCommonState } from "./slices/common/initialState"
// import { initialModelListState } from "./slices/modelList/initialState"
import { initialPreferenceState } from "./slices/preference/initialState"
import { initialSettingsState } from "./slices/settings/initialState"
// import { initialSyncState } from "./slices/sync/initialState"

export const initialState = {
  // ...initialSyncState,
  ...initialSettingsState,
  ...initialPreferenceState,
  ...initialAuthState,
  ...initialCommonState,
  // ...initialModelListState
}
