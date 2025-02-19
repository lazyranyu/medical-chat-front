import { defaultCache } from "@serwist/next/worker"
import { Serwist } from "serwist"

const serwist = new Serwist({
  clientsClaim: true,
  navigationPreload: true,
  precacheEntries: self.__SW_MANIFEST,
  runtimeCaching: defaultCache,
  skipWaiting: true
})

serwist.addEventListeners()
