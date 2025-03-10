// sort-imports-ignore
import { initialSessionListState } from './slices/list/initialState';
import { initialSessionSettingsState } from './slices/settings/initialState';

export const initialState = {
  ...initialSessionListState,
  ...initialSessionSettingsState,
  
  // 可以根据需要添加其他状态
}; 