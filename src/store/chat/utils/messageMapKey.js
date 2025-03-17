export const messageMapKey = (sessionId, topicId) => {
  let topic = topicId

  if (typeof topicId === "undefined") topic = null

  return `${sessionId}_${topic}`
}
