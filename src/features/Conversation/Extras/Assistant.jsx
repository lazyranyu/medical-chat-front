import { ModelTag } from '@lobehub/icons';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { messageSelectors } from '@/store/chat/selectors';

import ExtraContainer from './ExtraContainer';
import Translate from './Translate';

export const AssistantMessageExtra = memo(
  ({ extra, id, content }) => {
    const model = useAgentStore(agentSelectors.currentAgentModel);
    const loading = useChatStore(messageSelectors.isMessageGenerating(id));

    const showModelTag = extra?.fromModel && model !== extra?.fromModel;
    const showTranslate = !!extra?.translate;
    const showExtra = showModelTag || showTranslate;

    if (!showExtra) return;

    return (
      <Flexbox gap={8} style={{ marginTop: 8 }}>
        {showModelTag && (
          <div>
            <ModelTag model={extra?.fromModel} />
          </div>
        )}
        <>
          {extra?.translate && (
            <ExtraContainer>
              <Translate id={id} loading={loading} {...extra?.translate} />
            </ExtraContainer>
          )}
        </>
      </Flexbox>
    );
  }
); 