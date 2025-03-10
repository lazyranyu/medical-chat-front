import { authSelectors } from './slices/auth/selectors';
import { preferenceSelectors } from './slices/preference/selectors';
import { profileSelectors } from './slices/profile/selectors';
import { modelProviderSelectors } from './slices/modelProvider/selectors';

/**
 * 用户偏好设置选择器
 */
export { preferenceSelectors };

/**
 * 用户配置文件选择器
 */
export { profileSelectors as userProfileSelectors };

/**
 * 认证选择器
 */
export { authSelectors };

/**
 * 模型提供商选择器
 */
export { modelProviderSelectors };

/**
 * 用户通用设置选择器
 * 这里我们将 preferenceSelectors 中的一些选择器重新导出为 userGeneralSettingsSelectors
 */
export const userGeneralSettingsSelectors = {
    // 获取用户偏好设置
    config: preferenceSelectors.preference,
    
    // 获取当前语言
    currentLanguage: (s) => {
        const locale = preferenceSelectors.language(s);
        
        if (locale === 'auto') {
            // 如果是自动，则使用浏览器语言
            return navigator.language || 'zh-CN';
        }
        
        return locale;
    },
    
    // 获取当前主题模式
    currentThemeMode: (s) => {
        const themeMode = preferenceSelectors.theme(s);
        return themeMode || 'auto';
    },
    
    // 获取字体大小
    fontSize: (s) => s.preference.fontSize || 'medium',
    
    // 获取语言
    language: preferenceSelectors.language,
    
    // 获取中性色
    neutralColor: (s) => s.preference.neutralColor || 'gray',
    
    // 获取主色
    primaryColor: (s) => s.preference.primaryColor || 'blue',
};