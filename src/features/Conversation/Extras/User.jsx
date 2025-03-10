import { memo } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

import ExtraContainer from './ExtraContainer';
import Translate from './Translate';

export const UserMessageExtra = memo(({ extra, id, content }) => {
  const loading = useChatStore(chatSelectors.isMessageGenerating(id));

  const showTranslate = !!extra?.translate;
  const showExtra = showTranslate;

  if (!showExtra) return;

  return (
    <div style={{ marginTop: 8 }}>
      {extra?.translate && (
        <ExtraContainer>
          <Translate id={id} {...extra?.translate} loading={loading} />
        </ExtraContainer>
      )}
    </div>
  );
}); 