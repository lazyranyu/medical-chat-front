import { produce } from "immer"

export const sessionsReducer = (state, payload) => {
  switch (payload.type) {
    case "addSession": {
      return produce(state, draft => {
        const { session } = payload
        if (!session) return

        // TODO: 后续将 Date 类型做个迁移，就可以移除这里的 ignore 了
        // @ts-ignore
        draft.unshift({
          ...session,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    }

    case "removeSession": {
      return produce(state, draftState => {
        const index = draftState.findIndex(item => item.id === payload.id)
        if (index !== -1) {
          draftState.splice(index, 1)
        }
      })
    }

    case "updateSession": {
      return produce(state, draftState => {
        const { value, id } = payload
        const index = draftState.findIndex(item => item.id === id)

        if (index !== -1) {
          // @ts-ignore
          draftState[index] = {
            ...draftState[index],
            ...value,
            updatedAt: new Date()
          }
        }
      })
    }

    default: {
      return produce(state, () => {})
    }
  }
}
