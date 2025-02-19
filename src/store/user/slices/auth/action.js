import { subscribeWithSelector } from 'zustand/middleware';

import { enableClerk } from '@/const/auth';
import { useUserStore } from '../../store';

/**
 * 创建认证相关的动作
 *
 * 此函数定义了与认证相关的动作，包括启用认证、登出和打开登录界面
 * 它根据使用的认证服务（Clerk或NextAuth）的不同，动态导入相应的模块并调用相关方法
 *
 * @param {Function} set Zustand的set函数，用于更新状态
 * @param {Function} get Zustand的get函数，用于获取当前状态
 * @returns {Object} 包含认证相关动作的对象
 */
export const createAuthSlice = (set, get) => ({
    /**
     * 检查是否启用了认证
     *
     * 此函数返回一个布尔值，表示是否启用了Clerk或NextAuth认证
     *
     * @returns {boolean} 如果启用了Clerk或NextAuth认证，则返回true；否则返回false
     */
    enableAuth: () => {
        return enableClerk || get()?.enabledNextAuth || false;
    },
    /**
     * 执行登出操作
     *
     * 此函数根据启用的认证服务，动态导入相应的模块并调用登出方法
     * 如果使用的是Clerk，还会重定向到当前页面
     */
    logout: async () => {
        if (enableClerk) {
            const { signOut } = await import('@clerk/clerk-react');
            signOut({ redirectUrl: location.toString() });
            return;
        }

        const enableNextAuth = get().enabledNextAuth;
        if (enableNextAuth) {
            const { signOut } = await import('next-auth/react');
            await signOut();
        }
    },
    /**
     * 打开登录界面
     *
     * 此函数根据启用的认证服务，动态导入相应的模块并调用登录方法
     * 如果使用的是Clerk，还会根据提供的配置参数进行定制化登录流程
     * 如果使用的是NextAuth，且只有一个OAuth提供者，则直接使用该提供者进行登录
     */
    openLogin: async () => {
        if (enableClerk) {
            const { clerkSignIn } = await import('@clerk/clerk-react');
            const redirectUrl = location.toString();
            clerkSignIn({
                fallbackRedirectUrl: redirectUrl,
                signUpForceRedirectUrl: redirectUrl,
                signUpUrl: '/signup',
            });
            return;
        }

        const enableNextAuth = get().enabledNextAuth;
        if (enableNextAuth) {
            const { signIn } = await import('next-auth/react');
            const providers = get()?.oAuthSSOProviders;
            if (providers && providers.length === 1) {
                await signIn(providers[0]);
                return;
            }
            await signIn();
        }
    },
});
