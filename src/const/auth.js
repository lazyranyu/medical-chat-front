import { authEnv } from "@/config/auth"

export const enableClerk = authEnv.NEXT_PUBLIC_ENABLE_CLERK_AUTH
export const enableNextAuth = authEnv.NEXT_PUBLIC_ENABLE_NEXT_AUTH
export const enableAuth =
    authEnv.NEXT_PUBLIC_ENABLE_CLERK_AUTH || authEnv.NEXT_PUBLIC_ENABLE_NEXT_AUTH

export const LOBE_CHAT_AUTH_HEADER = "X-lobe-chat-auth"

export const OAUTH_AUTHORIZED = "X-oauth-authorized"

export const JWT_SECRET_KEY = "LobeHub · LobeChat"
export const NON_HTTP_PREFIX = "http_nosafe"
