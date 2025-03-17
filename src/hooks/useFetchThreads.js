import { useChatStore } from "@/store/chat"


export const useFetchThreads = activeTopicId => {

  const [useFetchThreads] = useChatStore(s => [s.useFetchThreads])

  useFetchThreads(activeTopicId)
}
