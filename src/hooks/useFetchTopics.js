import { useFetchThreads } from '@/hooks/useFetchThreads';
import { useChatStore } from '@/store/chat';

/**
 * Fetch topics for the current session
 */
export const useFetchTopics = () => {
  const [sessionId] = useChatStore((s) => [s.activeId]);
  const [activeTopicId, useFetchTopics] = useChatStore((s) => [s.activeTopicId, s.useFetchTopics]);

  useFetchTopics(true,sessionId);
  useFetchThreads(activeTopicId);
};
