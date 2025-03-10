'use client';

import { Icon } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { Loader2Icon } from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import { Virtuoso } from 'react-virtuoso';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { useStoreSelector } from '@/hooks/useStoreSelector';

import AutoScroll from '../AutoScroll';
import SkeletonList from '../SkeletonList';

const VirtualizedList = memo(({ mobile, dataSource, itemContent }) => {
  const virtuosoRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const id = useStoreSelector(useChatStore, chatSelectors.currentChatKey);
  const isFirstLoading = useStoreSelector(useChatStore, chatSelectors.currentChatLoadingState);
  const isCurrentChatLoaded = useStoreSelector(useChatStore, chatSelectors.isCurrentChatLoaded);

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ align: 'end', behavior: 'auto', index: 'LAST' });
    }
  }, [id]);

  const prevDataLengthRef = useRef(dataSource.length);

  const getFollowOutput = useCallback(() => {
    const newFollowOutput = dataSource.length > prevDataLengthRef.current ? 'auto' : false;
    prevDataLengthRef.current = dataSource.length;
    return newFollowOutput;
  }, [dataSource.length]);

  const theme = useTheme();
  // overscan should be 3 times the height of the window
  const overscan = typeof window !== 'undefined' ? window.innerHeight * 3 : 0;

  // first time loading or not loaded
  if (isFirstLoading) return <SkeletonList />;

  if (!isCurrentChatLoaded)
    // use skeleton list when not loaded in server mode due to the loading duration is much longer than client mode
    return (
      <SkeletonList />
    )

  return (
    <Flexbox height={'100%'}>
      <Virtuoso
        atBottomStateChange={setAtBottom}
        atBottomThreshold={50 * ( 1)}
        computeItemKey={(_, item) => item}
        data={dataSource}
        followOutput={getFollowOutput}
        increaseViewportBy={overscan}
        initialTopMostItemIndex={dataSource?.length - 1}
        isScrolling={setIsScrolling}
        itemContent={itemContent}
        overscan={overscan}
        ref={virtuosoRef}
      />
      <AutoScroll
        atBottom={atBottom}
        isScrolling={isScrolling}
        onScrollToBottom={(type) => {
          const virtuoso = virtuosoRef.current;
          switch (type) {
            case 'auto': {
              virtuoso?.scrollToIndex({ align: 'end', behavior: 'auto', index: 'LAST' });
              break;
            }
            case 'click': {
              virtuoso?.scrollToIndex({ align: 'end', behavior: 'smooth', index: 'LAST' });
              break;
            }
          }
        }}
      />
    </Flexbox>
  );
});

export default VirtualizedList; 