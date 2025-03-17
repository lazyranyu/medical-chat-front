const chatMessage = message => {
  return `<${message.role}>${message.content}</${message.role}>`
}

export const chatHistoryPrompts = messages => {
  return `<chat_history>
${messages.map(m => chatMessage(m)).join("\n")}
</chat_history>`
}
