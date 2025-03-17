'use client';

import { memo } from 'react';

import { useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

import SystemRoleContent from './SystemRoleContent';

const SystemRole = memo(() => {
  const isInbox = useSessionStore(sessionSelectors.isInboxSession);
  return !isInbox && <SystemRoleContent />;
});

export default SystemRole;
