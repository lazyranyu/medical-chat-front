export const messageMapKey = (topicId) => {
  let topic = topicId

  if (typeof topicId === "undefined") topic = null

  return `${topic}`
}
