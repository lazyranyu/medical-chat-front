import { useChatStore } from '@/store/chat';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useSessionStore } from '@/store/session';
import { useEffect } from 'react';

export const useFetchMessages = () => {
  const [sessionId] = useSessionStore((s) => [s.activeId]);
  const [activeTopicId, fetchMessages] = useChatStore((s) => [
    s.activeTopicId,
    s.fetchMessages,
  ]);

  useEffect(() => {
    if (sessionId) {
      fetchMessages(sessionId, activeTopicId);
    }
  }, [sessionId, activeTopicId, fetchMessages]);
};
