'use client';

import { Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import common from "@/locales/default/common";
export default () => {
  const { t } = useTranslation('common');
  return (
    <Center height={'100%'} width={'100%'}>
      <Flexbox align={'center'} gap={8}>
        <div>
          <Icon icon={LoaderCircle} size={'large'} spin />
        </div>
        <Typography.Text style={{ letterSpacing: '0.1em' }} type={'secondary'}>
          {common.loading}
        </Typography.Text>
      </Flexbox>
    </Center>
  );
};
