// 引入各个状态切片的初始状态
import { initialAuthState } from './slices/auth/initialState';
// import { initialCommonState } from './slices/common/initialState';
// import { initialModelListState } from './slices/modelList/initialState';
// import { initialPreferenceState } from './slices/preference/initialState';
// import { initialSettingsState } from './slices/settings/initialState';
// import { initialSyncState } from './slices/sync/initialState';

// 定义整个用户状态的初始状态，通过合并各个切片的初始状态
export const initialState = {
    // ...initialSyncState,
    // ...initialSettingsState,
    // ...initialPreferenceState,
    ...initialAuthState,
    // ...initialCommonState,
    // ...initialModelListState,
};