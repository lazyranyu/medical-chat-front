import { useChatStore } from '@/store/chat';


export const useFetchMessages = () => {
  const [activeTopicId, useFetchMessages] = useChatStore((s) => [
    s.activeTopicId,
    s.useFetchMessages,
  ]);

  useFetchMessages(activeTopicId);
};
