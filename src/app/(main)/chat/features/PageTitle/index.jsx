'use client';

import { memo } from 'react';

import PageTitle from '@/components/PageTitle';
// import { useChatStore } from '@/store/chat';
// import { topicSelectors } from '@/store/chat/selectors';
// import { useSessionStore } from '@/store/session';
// import { sessionMetaSelectors } from '@/store/session/selectors';



const Title = memo(() => {
    // const agentTitle = useSessionStore(sessionMetaSelectors.currentAgentTitle);
    // const topicTitle = useChatStore((s) => topicSelectors.currentActiveTopic(s)?.title);
    const agentTitle = 'li';
    const topicTitle = 'lo';
    return <PageTitle title={[topicTitle, agentTitle].filter(Boolean).join(' · ')} />;
});

export default Title;
