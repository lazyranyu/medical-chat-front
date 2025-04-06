'use client';

import { ActionIcon, EditableMessage } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { Edit } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';
import useMergeState from 'use-merge-value';

import SidebarHeader from '@/components/SidebarHeader';
import AgentInfo from '@/features/AgentInfo';
import { useOpenChatSettings } from '@/hooks/useInterceptingRoutes';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { useGlobalStore } from '@/store/global';
import { ChatSettingsTabs } from '@/store/global/initialState';
import { systemStatusSelectors } from '@/store/global/selectors';
import { defaultMeta } from '@/const/session';

import { useStyles } from './style';
import common from "@/locales/default/common";
import setting from "@/locales/default/setting";

const SystemRole = memo(() => {
  const [editing, setEditing] = useState(false);
  const { styles } = useStyles();
  const openChatSettings = useOpenChatSettings(ChatSettingsTabs.Prompt);
  const meta = defaultMeta;

  const [systemRole, updateAgentConfig] = useAgentStore((s) => [
    agentSelectors.currentAgentSystemRole(s),
    s.updateAgentConfig,
  ]);

  const [showSystemRole, toggleSystemRole] = useGlobalStore((s) => [
    systemStatusSelectors.showSystemRole(s),
    s.toggleSystemRole,
  ]);

  const [open, setOpen] = useMergeState(false, {
    defaultValue: showSystemRole,
    onChange: toggleSystemRole,
    value: showSystemRole,
  });

  // const { t } = useTranslation('common');

  const handleOpenWithEdit = () => {
    setEditing(true);
    setOpen(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Flexbox height={'fit-content'}>
      <SidebarHeader
        actions={
          <ActionIcon icon={Edit} onClick={handleOpenWithEdit} size={'small'} title={common.edit} />
        }
        title={setting.settingAgent.prompt.title}
      />
      <Flexbox
        className={styles.promptBox}
        height={200}
        onClick={handleOpen}
        onDoubleClick={(e) => {
          if (e.altKey) handleOpenWithEdit();
        }}
      >
        {(
          <>
            <EditableMessage
              classNames={{ markdown: styles.prompt }}
              editing={editing}
              model={{
                extra: (
                  <AgentInfo
                    meta={meta}
                    onAvatarClick={() => {
                      setOpen(false);
                      setEditing(false);
                      openChatSettings();
                    }}
                    style={{ marginBottom: 16 }}
                  />
                ),
              }}
              onChange={(e) => {
                updateAgentConfig({ systemRole: e });
              }}
              onEditingChange={setEditing}
              onOpenChange={setOpen}
              openModal={open}
              placeholder={`${setting.settingAgent.prompt.placeholder}...`}
              styles={{ markdown: systemRole ? {} : { opacity: 0.5 } }}
              text={{
                cancel: common.cancel,
                confirm: common.ok,
                edit: common.edit,
                title: setting.settingAgent.prompt.title,
              }}
              value={systemRole}
            />
            <div className={styles.promptMask} />
          </>
        )}
      </Flexbox>
    </Flexbox>
  );
});

export default SystemRole;
