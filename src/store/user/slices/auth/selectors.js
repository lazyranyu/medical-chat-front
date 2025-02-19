import { t } from 'i18next';

import { enableClerk } from '@/const/auth';
import { BRANDING_NAME } from '@/const/branding';

const DEFAULT_USERNAME = BRANDING_NAME;

// 获取用户昵称
const nickName = (s) => {
    // 如果没有启用认证，则返回默认昵称
    if (!s.enableAuth()) return t('userPanel.defaultNickname', { ns: 'common' });

    // 如果用户已登录，则返回用户的全名或用户名
    if (s.isSignedIn) return s.user?.fullName || s.user?.username;

    // 如果用户未登录，则返回匿名昵称
    return t('userPanel.anonymousNickName', { ns: 'common' });
};

// 获取用户名
const username = (s) => {
    // 如果没有启用认证，则返回默认用户名
    if (!s.enableAuth()) return DEFAULT_USERNAME;

    // 如果用户已登录，则返回用户的用户名
    if (s.isSignedIn) return s.user?.username;

    // 如果用户未登录，则返回匿名
    return 'anonymous';
};

// 导出用户资料选择器
export const userProfileSelectors = {
    nickName,
    // 获取用户头像
    userAvatar: (s) => s.user?.avatar || '',
    // 获取用户ID
    userId: (s) => s.user?.id,
    // 获取用户资料
    userProfile: (s) => s.user,
    // 获取用户名
    username,
};

// 判断用户是否已登录
const isLogin = (s) => {
    // 如果没有启用认证，则返回true
    if (!s.enableAuth()) return true;
    // 如果用户已登录，则返回true
    return s.isSignedIn;
};

// 导出认证选择器
export const authSelectors = {
    // 判断是否启用认证
    enabledAuth: (s) => s.enableAuth(),
    // 判断是否启用NextAuth
    enabledNextAuth: (s) => !!s.enabledNextAuth,
    // 判断是否已加载
    isLoaded: (s) => s.isLoaded,
    // 判断用户是否已登录
    isLogin,
    // 判断用户是否已登录并认证
    isLoginWithAuth: (s) => s.isSignedIn,
    // 判断用户是否已登录并使用Clerk认证
    isLoginWithClerk: (s) => (s.isSignedIn && enableClerk) || false,
    // 判断用户是否已登录并使用NextAuth认证
    isLoginWithNextAuth: (s) => (s.isSignedIn && !!s.enabledNextAuth) || false,
};
