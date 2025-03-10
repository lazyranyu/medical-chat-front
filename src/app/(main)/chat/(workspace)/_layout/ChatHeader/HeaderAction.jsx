'use client';

import { ActionIcon } from '@lobehub/ui';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
// import { useGlobalStore } from '@/store/global';
// import { systemStatusSelectors } from '@/store/global/selectors';
// import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

import SettingButton from '../../features/SettingButton';
import ShareButton from '../../features/ShareButton';
import chat from "@/locales/default/chat";

const HeaderAction = memo(() => {
  // const { t } = useTranslation('chat');
  //
  // const [showAgentSettings, toggleConfig] = useGlobalStore((s) => [
  //   systemStatusSelectors.showChatSideBar(s),
  //   s.toggleChatSideBar,
  // ]);
  //
  // const { isAgentEditable } = useServerConfigStore(featureFlagsSelectors);

    function toggleConfig() {
        console.log('toggleConfig')
    }

    return (
    <>
      <ShareButton />
      <ActionIcon
        // icon={showAgentSettings ? PanelRightClose : PanelRightOpen}
          icon={PanelRightClose}
        onClick={() => toggleConfig()}
        size={DESKTOP_HEADER_ICON_SIZE}
        title={chat.roleAndArchive}
      />
      {/*{isAgentEditable && <SettingButton />}*/}
        {<SettingButton />}
    </>
  );
});

export default HeaderAction;
