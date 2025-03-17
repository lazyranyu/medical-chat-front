import { ChatItem } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import {DEFAULT_AVATAR, DEFAULT_BACKGROUND_COLOR, DEFAULT_INBOX_AVATAR} from "@/const/meta";
import chat from "@/locales/default/chat";

const WelcomeMessage = () => {
  const [type = 'chat'] = useAgentStore((s) => {
    const config = agentSelectors.currentAgentChatConfig(s);
    return [config.displayMode];
  });

  const meta = {
    avatar: DEFAULT_INBOX_AVATAR,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    description: chat.inbox.desc,
    title: chat.inbox.title,
  };
  const activeId = useChatStore((s) => s.activeId);


  const agentSystemRoleMsg = chat.agentDefaultMessageWithSystemRole
      .replace(/name/g,meta.title)
      .replace(/systemRole/g, meta.description)

  const agentMsg =chat.agentDefaultMessageWithoutEdit
      .replace(/name/g,meta.title)
      .replace(/url/g,`/chat/settings?session=${activeId}`)


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
