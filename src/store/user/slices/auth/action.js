import { enableClerk } from "@/const/auth"
import { login as apiLogin, getCurrentUser } from "@/api/user/auth";

export const createAuthSlice = (set, get) => ({
  enableAuth: () => {
    return enableClerk || get()?.enabledNextAuth || false
  },
  logout: async () => {
    if (enableClerk) {
      get().clerkSignOut?.({ redirectUrl: location.toString() })

      return
    }

    const enableNextAuth = get().enabledNextAuth
    if (enableNextAuth) {
      const { signOut } = await import("next-auth/react")
      signOut()
    }
  },
  openLogin: async () => {
    if (enableClerk) {
      const reditectUrl = location.toString()
      get().clerkSignIn?.({
        fallbackRedirectUrl: reditectUrl,
        signUpForceRedirectUrl: reditectUrl,
        signUpUrl: "/signup"
      })

      return
    }

    const enableNextAuth = get().enabledNextAuth
    if (enableNextAuth) {
      const { signIn } = await import("next-auth/react")
      // Check if only one provider is available
      const providers = get()?.oAuthSSOProviders
      if (providers && providers.length === 1) {
        signIn(providers[0])
        return
      }
      signIn()
    }
  },
  loginAsync: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await apiLogin(credentials);
      // 登录成功后获取用户信息
      const user = await getCurrentUser();
      set({
        user,
        isSignedIn: true,
        isLoading: false,
        // 你可以根据需要设置 token 等
      });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
})
