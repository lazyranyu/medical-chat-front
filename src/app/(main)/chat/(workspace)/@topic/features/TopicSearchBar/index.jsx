'use client';

import { SearchBar } from '@lobehub/ui';
import { useUnmount } from 'ahooks';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';
import {topicSelectors} from "@/store";

const TopicSearchBar = memo(({ onClear }) => {
  const { t } = useTranslation('topic');

  const [keywords, setKeywords] = useState('');
  const activeId = useChatStore.getState().activeId;
  const [useSearchTopics] = topicSelectors(useChatStore,state=>state.useSearchTopics());
  useSearchTopics(keywords, activeId);
  useUnmount(() => {
    useChatStore.setState({ isSearchingTopic: false });
  });
  return (
    <SearchBar
      autoFocus
      onBlur={() => {
        if (keywords === '') onClear?.();
      }}
      onChange={(e) => {
        const value = e.target.value;

        setKeywords(value);
        useChatStore.setState({ isSearchingTopic: !!value });
      }}
      placeholder={t('searchPlaceholder')}
      spotlight={true}
      type={'ghost'}
      value={keywords}
    />
  );
});

export default TopicSearchBar;
