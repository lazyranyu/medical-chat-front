import { useFetchThreads } from '@/hooks/useFetchThreads';
import { useChatStore } from '@/store/chat';
import { useSessionStore } from '@/store/session';

/**
 * Fetch topics for the current session
 */
export const useFetchTopics = () => {
  const [sessionId] = useSessionStore((s) => [s.activeId]);
  const [activeTopicId, useFetchTopics] = useChatStore((s) => [s.activeTopicId, s.useFetchTopics]);

  useFetchTopics(sessionId);
  useFetchThreads(activeTopicId);
};
