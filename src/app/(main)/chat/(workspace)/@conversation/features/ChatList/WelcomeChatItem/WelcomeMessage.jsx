import { ChatItem } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import {DEFAULT_AVATAR, DEFAULT_BACKGROUND_COLOR, DEFAULT_INBOX_AVATAR} from "@/const/meta";
import {t} from "i18next";

const WelcomeMessage = () => {
  const { t } = useTranslation('chat');
  const [type = 'chat'] = useAgentStore((s) => {
    const config = agentSelectors.currentAgentChatConfig(s);
    return [config.displayMode];
  });

  const meta = {
    avatar: DEFAULT_INBOX_AVATAR,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    description: t('inbox.desc', { ns: 'chat' }),
    title: t('inbox.title', { ns: 'chat' }),
  };
  const activeId = useChatStore((s) => s.activeId);

  const agentSystemRoleMsg = t('agentDefaultMessageWithSystemRole', {
    name: meta.title || t('defaultAgent'),
    systemRole: meta.description,
  });

  const agentMsg = t('agentDefaultMessageWithoutEdit', {
    name: meta.title || t('defaultAgent'),
    url: `/chat/settings?session=${activeId}`,
  });

  return (
    <ChatItem
      avatar={meta}
      editing={false}
      message={!!meta.description ? agentSystemRoleMsg : agentMsg}
      placement={'left'}
      type={type === 'chat' ? 'block' : 'pure'}
    />
  );
};
export default WelcomeMessage;
