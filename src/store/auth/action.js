import { userService} from "@/api/user";
import Cookies from 'js-cookie';
import {initialState} from "@/store/auth/initialState";

export const createUserActions = (set, get) => ({
    // 登录并获取用户信息
    login: async (credentials,loginType) => {
        set({ isLoading: true, error: null });
        try {
            const data = await userService.login(credentials); // 调用登录接口

            localStorage.setItem('auth_token', data.token); // 假设接口返回 token 字段
            Cookies.set('auth_token', data.token, {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                expires: 7
            });
            const user = data.user; // 获取用户信息
            console.log('Login, new isLogin:', get().isLogin)
            set({
                userId: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl,
                isLogin: true,
                isLoading: false,
            });
            console.log('Login success, new isLogin:', get().isLogin)
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const data = await userService.register(credentials);
            localStorage.setItem('auth_token', data.token);
            // 设置名为auth_token的cookie，值为data.token
            // secure属性表示是否使用https协议，如果当前环境为生产环境，则使用https协议
            // sameSite属性表示cookie的sameSite属性，Strict表示cookie只能在同源请求中发送
            // expires属性表示cookie的过期时间，7天
            Cookies.set('auth_token', data.token, {
                secure: true,
                sameSite: 'Strict',
                expires: 3
            });
            const user = data.user; // 获取用户信息
            set({
                userId: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl,
                isLogin: true,
                isLoading: false,
            });
        }catch (error){
            set({ error: error.message, isLoading: false });
        }
    },

    // 更新用户信息
    setUser: (user) =>
        set({
            userId: user.id,
            username: user.username,
            avatarUrl: user.avatarUrl,
            isAuthenticated: true,
        }),

    // 清除用户信息（登出）
    logout: () => {
        set(initialState);
    },

    // 更新头像
    updateAvatar: (avatarUrl) =>
        set({ avatarUrl }),

    // 更新用户名
    updateUsername: (username) =>
        set({ username }),
});