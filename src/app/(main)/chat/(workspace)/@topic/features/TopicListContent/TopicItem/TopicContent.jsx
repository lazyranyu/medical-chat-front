import { ActionIcon, EditableText, Icon } from '@lobehub/ui';
import { App, Dropdown, Typography } from 'antd';
import { createStyles } from 'antd-style';
import {
  LucideCopy,
  LucideLoader2,
  MoreVertical,
  PencilLine,
  Star,
  Trash,
  Wand2,
} from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import BubblesLoading from '@/components/BubblesLoading';
import { LOADING_FLAT } from '@/const/message';
import { useChatStore } from '@/store/chat';
import topic from '@/locales/default/topic'
import common from "@/locales/default/common";

const useStyles = createStyles(({ css }) => ({
  content: css`
    position: relative;
    overflow: hidden;
    flex: 1;
  `,
  title: css`
    flex: 1;
    height: 28px;
    line-height: 28px;
    text-align: start;
  `,
}));
const { Paragraph } = Typography;

const TopicContent = memo(({ id, title, fav, showMore }) => {
  // const { t } = useTranslation(["topic", "common"]);
    const [
        editing,
        favoriteTopic,
        updateTopicTitle,
        removeTopic,
        autoRenameTopicTitle,
        duplicateTopic,
        isLoading,
    ] = useChatStore((s) => [
        s.topicRenamingId === id,
        s.favoriteTopic,
        s.updateTopicTitle,
        s.removeTopic,
        s.autoRenameTopicTitle,
        s.duplicateTopic,
        s.topicLoadingIds.includes(id),
    ]);
  const { styles, theme } = useStyles()

  const toggleEditing = visible => {
    useChatStore.setState({ topicRenamingId: visible ? id : "" })
  }

  const { modal } = App.useApp()

  const items = useMemo(
      () => [
        {
          icon: <Icon icon={Wand2} />,
          key: "autoRename",
          label: topic.actions.autoRename,
          onClick: () => {
            autoRenameTopicTitle(id)
          }
        },
        {
          icon: <Icon icon={PencilLine} />,
          key: "rename",
          label: common.rename,
          onClick: () => {
            toggleEditing(true)
          }
        },
        {
          type: "divider"
        },
        {
          icon: <Icon icon={LucideCopy} />,
          key: "duplicate",
          label: topic.actions.duplicate,
          onClick: () => {
            duplicateTopic(id)
          }
        },
        // {
        //   icon: <Icon icon={LucideDownload} />,
        //   key: 'export',
        //   label: t('topic.actions.export'),
        //   onClick: () => {
        //     configService.exportSingleTopic(sessionId, id);
        //   },
        // },
        {
          type: "divider"
        },
        // {
        //   icon: <Icon icon={Share2} />,
        //   key: 'share',
        //   label: t('share'),
        // },
        {
          danger: true,
          icon: <Icon icon={Trash} />,
          key: "delete",
          label: common.delete,
          onClick: () => {
            if (!id) return

            modal.confirm({
              centered: true,
              okButtonProps: { danger: true },
              onOk: async () => {
                await removeTopic(id)
              },
              title: topic.actions.confirmRemoveTopic
            })
          }
        }
      ],
      []
  )

  return (
      <Flexbox
          align={"center"}
          gap={8}
          horizontal
          justify={"space-between"}
          onDoubleClick={e => {
            if (!id) return
            if (e.altKey) toggleEditing(true)
          }}
      >
        <ActionIcon
            color={fav && !isLoading ? theme.colorWarning : undefined}
            fill={fav && !isLoading ? theme.colorWarning : "transparent"}
            icon={isLoading ? LucideLoader2 : Star}
            onClick={e => {
              e.stopPropagation()
              if (!id) return
              favoriteTopic(id, !fav)
            }}
            size={"small"}
            spin={isLoading}
        />
        {!editing ? (
            title === LOADING_FLAT ? (
                <Flexbox flex={1} height={28} justify={"center"}>
                  <BubblesLoading />
                </Flexbox>
            ) : (
                <Paragraph
                    className={styles.title}
                    ellipsis={{ rows: 1, tooltip: { placement: "left", title, styles: { root: {} }, classNames: { root: "" } } }}
                    style={{ margin: 0 }}
                >
                  {title}
                </Paragraph>
            )
        ) : (
            <EditableText
                editing={editing}
                onChangeEnd={v => {
                  if (title !== v) {
                    updateTopicTitle(id, v)
                  }
                  toggleEditing(false)
                }}
                onEditingChange={toggleEditing}
                showEditIcon={false}
                size={"small"}
                style={{
                  height: 28
                }}
                type={"pure"}
                value={title}
            />
        )}
        {(showMore) && !editing && (
            <Dropdown
                arrow={false}
                menu={{
                  items: items,
                  onClick: ({ domEvent }) => {
                    domEvent.stopPropagation()
                  }
                }}
                trigger={["click"]}
            >
              <ActionIcon
                  className="topic-more"
                  icon={MoreVertical}
                  onClick={e => {
                    e.stopPropagation()
                  }}
                  size={"small"}
              />
            </Dropdown>
        )}
      </Flexbox>
  )
})

export default TopicContent
