export const sessionGroupsReducer = (state, payload) => {
  switch (payload.type) {
    case "addSessionGroupItem": {
      return [...state, payload.item]
    }

    case "deleteSessionGroupItem": {
      return state.filter(item => item.id !== payload.id)
    }

    case "updateSessionGroupItem": {
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...item, ...payload.item }
        }
        return item
      })
    }

    case "updateSessionGroupOrder": {
      return state
          .map(item => {
            const sort = payload.sortMap.find(i => i.id === item.id)?.sort
            return { ...item, sort }
          })
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    }

    default: {
      return state
    }
  }
}
