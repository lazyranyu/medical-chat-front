import { ActionIcon, Icon, Markdown, Tag, copyToClipboard } from '@lobehub/ui';
import { App } from 'antd';
import { useTheme } from 'antd-style';
import { ChevronDown, ChevronUp, ChevronsRight, CopyIcon, TrashIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import BubblesLoading from '@/components/BubblesLoading';
import { useChatStore } from '@/store/chat';
import common from "@/locales/default/common";
import chat from "@/locales/default/chat";

const Translate = memo(({ content = '', from, to, id, loading }) => {
  const theme = useTheme();
  const [show, setShow] = useState(true);
  const clearTranslate = useChatStore((s) => s.clearTranslate);

  const { message } = App.useApp();
  return (
    <Flexbox gap={8}>
      <Flexbox align={'center'} horizontal justify={'space-between'}>
        <div>
          <Flexbox gap={4} horizontal>
            <Tag style={{ margin: 0 }}>{from ? common.lang[from] : '...'}</Tag>
            <Icon color={theme.colorTextTertiary} icon={ChevronsRight} />
            <Tag>{common.lang[to]}</Tag>
          </Flexbox>
        </div>
        <Flexbox horizontal>
          <ActionIcon
            icon={CopyIcon}
            onClick={async () => {
              await copyToClipboard(content);
              message.success(common.copySuccess);
            }}
            size={'small'}
            title={common.copy}
          />
          <ActionIcon
            icon={TrashIcon}
            onClick={() => {
              clearTranslate(id);
            }}
            size={'small'}
            title={chat.translate.clear}
          />
          <ActionIcon
            icon={show ? ChevronDown : ChevronUp}
            onClick={() => {
              setShow(!show);
            }}
            size={'small'}
          />
        </Flexbox>
      </Flexbox>
      {!show ? null : loading && !content ? (
        <BubblesLoading />
      ) : (
        <Markdown variant={'chat'}>{content}</Markdown>
      )}
    </Flexbox>
  );
});

export default Translate; 