// 引入用户通用设置选择器
import { userGeneralSettingsSelectors } from './slices/settings/selectors';
// 引入用户存储的 hook
import { useUserStore } from './store';

// 定义一个函数用于获取当前语言设置
const getCurrentLanguage = () =>
    userGeneralSettingsSelectors.currentLanguage(useUserStore.getState());

// 导出一个包含 getCurrentLanguage 函数的对象
export const globalHelpers = {
    getCurrentLanguage,
};