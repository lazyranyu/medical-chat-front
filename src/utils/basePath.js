import { appEnv } from "@/config/app"

export const withBasePath = path => appEnv.NEXT_PUBLIC_BASE_PATH + path
