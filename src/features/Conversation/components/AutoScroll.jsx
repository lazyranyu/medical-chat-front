import { memo, useEffect } from 'react';

import { useChatStore } from '@/store/chat';
import { messageSelectors } from '@/store/chat/selectors';
import { useStoreSelector } from '@/hooks/useStoreSelector';

import BackBottom from './BackBottom';

const AutoScroll = memo(({ atBottom, isScrolling, onScrollToBottom }) => {
  const trackVisibility = useStoreSelector(useChatStore, messageSelectors.isAIGenerating);
  const str = useStoreSelector(messageSelectors.mainAIChatsMessageString);

  useEffect(() => {
    console.log('AutoScroll 组件状态:', {
      atBottom,
      isScrolling,
      trackVisibility,
      strLength: str?.length || 0
    });
  }, [atBottom, isScrolling, trackVisibility, str]);

  useEffect(() => {
    if (atBottom && trackVisibility && !isScrolling) {
      console.log('AutoScroll 触发自动滚动');
      onScrollToBottom?.('auto');
    }
  }, [atBottom, trackVisibility, str, onScrollToBottom, isScrolling]);

  return <BackBottom onScrollToBottom={() => onScrollToBottom('click')} visible={!atBottom} />;
});

export default AutoScroll; 