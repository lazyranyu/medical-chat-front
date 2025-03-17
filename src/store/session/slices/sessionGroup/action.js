import { t } from "i18next"

import { message } from "@/components/AntdStaticMethods"
import { sessionService} from "@/api/session";

import { sessionGroupsReducer } from "./reducer"

/* eslint-enable */

export const createSessionGroupSlice = (set, get) => ({
  addSessionGroup: async name => {
    const id = await sessionService.createSessionGroup(name)

    await get().refreshSessions()

    return id
  },

  clearSessionGroups: async () => {
    await sessionService.removeSessionGroups()
    await get().refreshSessions()
  },

  removeSessionGroup: async id => {
    await sessionService.removeSessionGroup(id)
    await get().refreshSessions()
  },

  updateSessionGroupName: async (id, name) => {
    await sessionService.updateSessionGroup(id, { name })
    await get().refreshSessions()
  },
  updateSessionGroupSort: async items => {
    const sortMap = items.map((item, index) => ({ id: item.id, sort: index }))

    get().internal_dispatchSessionGroups({
      sortMap,
      type: "updateSessionGroupOrder"
    })

    message.loading({
      content: t("sessionGroup.sorting", { ns: "chat" }),
      duration: 0,
      key: "updateSessionGroupSort"
    })

    await sessionService.updateSessionGroupOrder(sortMap)
    message.destroy("updateSessionGroupSort")
    message.success(t("sessionGroup.sortSuccess", { ns: "chat" }))

    await get().refreshSessions()
  },

  /* eslint-disable sort-keys-fix/sort-keys-fix */
  internal_dispatchSessionGroups: payload => {
    const nextSessionGroups = sessionGroupsReducer(get().sessionGroups, payload)
    get().internal_processSessions(
        get().sessions,
        nextSessionGroups,
        "updateSessionGroups"
    )
  }
})
