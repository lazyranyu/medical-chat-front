import { useFetchThreads } from '@/hooks/useFetchThreads';
import { useChatStore } from '@/store/chat';

/**
 * Fetch topics for the current session
 */
export const useFetchTopics = () => {
  const [activeTopicId, useFetchTopics] = useChatStore((s) => [s.activeTopicId, s.useFetchTopics]);

  useFetchTopics();
  useFetchThreads(activeTopicId);
};
