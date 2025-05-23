import { ActionIcon } from '@lobehub/ui';
import { Book, Github } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { DOCUMENTS_REFER_URL, GITHUB } from '@/const/url';
import common from "@/locales/default/common";
// import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const BottomActions = memo(() => {
  const { t } = useTranslation('common');
  // const { hideGitHub, hideDocs } = useServerConfigStore(featureFlagsSelectors);

  return (
    <>
      { (
        <Link aria-label={'GitHub'} href={GITHUB} target={'_blank'}>
          <ActionIcon icon={Github} placement={'right'} title={'GitHub'} />
        </Link>
      )}
      { (
        <Link aria-label={common.document} href={DOCUMENTS_REFER_URL} target={'_blank'}>
          <ActionIcon icon={Book} placement={'right'} title={common.document} />
        </Link>
      )}
    </>
  );
});

export default BottomActions;
