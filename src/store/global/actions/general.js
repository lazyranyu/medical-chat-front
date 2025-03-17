import isEqual from "fast-deep-equal"
import { gt, parse, valid } from "semver"

import { CURRENT_VERSION } from "@/const/version"
import { useOnlyFetchOnceSWR } from "@/libs/swr"
// import { globalService } from "@/services/global"
import { switchLang } from "@/utils/client/switchLang"
import { merge } from "@/utils/merge"
import { setNamespace } from "@/utils/storeDebug"

const n = setNamespace("g")

export const generalActionSlice = (set, get) => ({
  switchLocale: locale => {
    get().updateSystemStatus({ language: locale })

    switchLang(locale)
  },
  updateSystemStatus: (status, action) => {
    // Status cannot be modified when it is not initialized
    if (!get().isStatusInit) return

    const nextStatus = merge(get().status, status)
    if (isEqual(get().status, nextStatus)) return

    set({ status: nextStatus }, false, action || n("updateSystemStatus"))

    get().statusStorage.saveToLocalStorage(nextStatus)
  },

  // useCheckLatestVersion: (enabledCheck = true) =>
  //     useOnlyFetchOnceSWR(
  //         enabledCheck ? "checkLatestVersion" : null,
  //         // async () => globalService.getLatestVersion(),
  //         {
  //           // check latest version every 30 minutes
  //           focusThrottleInterval: 1000 * 60 * 30,
  //           onSuccess: data => {
  //             if (!valid(CURRENT_VERSION) || !valid(data)) return
  //
  //             // Parse versions to ensure we're working with valid SemVer objects
  //             const currentVersion = parse(CURRENT_VERSION)
  //             const latestVersion = parse(data)
  //
  //             if (!currentVersion || !latestVersion) return
  //
  //             // only compare major and minor versions
  //             // solve the problem of frequent patch updates
  //             const currentMajorMinor = `${currentVersion.major}.${currentVersion.minor}.0`
  //             const latestMajorMinor = `${latestVersion.major}.${latestVersion.minor}.0`
  //
  //             if (gt(latestMajorMinor, currentMajorMinor)) {
  //               set(
  //                   { hasNewVersion: true, latestVersion: data },
  //                   false,
  //                   n("checkLatestVersion")
  //               )
  //             }
  //           }
  //         }
  //     ),

  useInitSystemStatus: () =>
      useOnlyFetchOnceSWR(
          "initSystemStatus",
          () => get().statusStorage.getFromLocalStorage(),
          {
            onSuccess: status => {
              set({ isStatusInit: true }, false, "setStatusInit")

              get().updateSystemStatus(status, "initSystemStatus")
            }
          }
      )
})
