const sessionGroupItems = s => s.sessionGroups

const getGroupById = id => s =>
    sessionGroupItems(s).find(group => group.id === id)

export const sessionGroupSelectors = {
  getGroupById,
  sessionGroupItems
}
