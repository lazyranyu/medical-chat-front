'use client';

import { ActionIcon, Avatar, ChatHeaderTitle } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { Suspense, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
// import { useOpenChatSettings } from '@/hooks/useInterceptingRoutes';
// import { useGlobalStore } from '@/store/global';
// import { systemStatusSelectors } from '@/store/global/selectors';
// import { useSessionStore } from '@/store/session';
// import { sessionMetaSelectors, sessionSelectors } from '@/store/session/selectors';
//
// import { useInitAgentConfig } from '../../useInitAgentConfig';
import chat from "@/locales/default/chat";

const Main = memo(() => {
  // const { t } = useTranslation('chat');

  // useInitAgentConfig();
  // const [isPinned] = useQueryState('pinned', parseAsBoolean);

  // const [init, isInbox, title, description, avatar, backgroundColor] = useSessionStore((s) => [
  //   sessionSelectors.isSomeSessionActive(s),
  //   sessionSelectors.isInboxSession(s),
  //   sessionMetaSelectors.currentAgentTitle(s),
  //   sessionMetaSelectors.currentAgentDescription(s),
  //   sessionMetaSelectors.currentAgentAvatar(s),
  //   sessionMetaSelectors.currentAgentBackgroundColor(s),
  // ]);
    const init = true; // 强制显示初始化完成状态
    const isInbox = false;
    const title = '默认会话标题';
    const description = '默认会话描述';
    const avatar = '🔮'; // 或使用本地图片路径
    const backgroundColor = '#e8e8e8';

  // const openChatSettings = useOpenChatSettings();

  const displayTitle = isInbox ? chat.inbox.title : title;
  const displayDesc = isInbox ? chat.inbox.desc : description;
  // const showSessionPanel = useGlobalStore(systemStatusSelectors.showSessionPanel);
  // const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  return !init ? (
    <Flexbox horizontal>
      <Skeleton
        active
        avatar={{ shape: 'circle', size: 'default' }}
        paragraph={false}
        title={{ style: { margin: 0, marginTop: 8 }, width: 200 }}
      />
    </Flexbox>
  ) : (
    <Flexbox align={'center'} gap={4} horizontal>
      {/*{!isPinned && (*/}{(
        <ActionIcon
          aria-label={chat.agents}
          // icon={showSessionPanel ? PanelLeftClose : PanelLeftOpen}
          icon={PanelLeftOpen}
          // onClick={() => {
          //   updateSystemStatus({
          //     sessionsWidth: showSessionPanel ? 0 : 320,
          //     showSessionPanel: !showSessionPanel,
          //   });
          // }}
          onClick={() => {
              console.log('切换侧边栏状态（待实现）');
              // 原状态管理逻辑已移除
          }}
          size={DESKTOP_HEADER_ICON_SIZE}
          title={chat.agents}
        />
      )}
      <Avatar
        avatar={avatar}
        background={backgroundColor}
        // onClick={() => openChatSettings()}
        onClick={() => console.log('打开设置（待实现）')}
        size={40}
        title={title}
      />
      <ChatHeaderTitle desc={displayDesc} title={displayTitle} />
    </Flexbox>
  );
});

export default () => (
  <Suspense
    fallback={
      <Skeleton
        active
        avatar={{ shape: 'circle', size: 'default' }}
        paragraph={false}
        title={{ style: { margin: 0, marginTop: 8 }, width: 200 }}
      />
    }
  >
    <Main />
  </Suspense>
);
