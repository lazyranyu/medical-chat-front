import { ActionEvent, ActionIconGroup } from '@lobehub/ui';
import { App } from 'antd';
import isEqual from 'fast-deep-equal';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';
import { messageSelectors } from '@/store/chat/selectors';
import { useStoreSelector } from '@/hooks/useStoreSelector';

import { renderActions } from '../../Actions';
import { useChatListActionsBar } from '../../hooks/useChatListActionsBar';

const ActionsBar = memo(props => {
  const { regenerate, edit, copy, divider, del } = useChatListActionsBar()

  return (
      <ActionIconGroup
          dropdownMenu={[edit, copy, regenerate, divider, del]}
          items={[regenerate, edit]}
          type="ghost"
          {...props}
      />
  )
})

const Actions = memo(({ id, inPortalThread }) => {
  const item = useChatStore(messageSelectors.getMessageById(id), isEqual)
  const { t } = useTranslation("common")
  const [
    deleteMessage,
    regenerateMessage,
    delAndRegenerateMessage,
    copyMessage,
    openThreadCreator,
    resendThreadMessage,
    delAndResendThreadMessage,
    toggleMessageEditing
  ] = useChatStore(s => [
    s.deleteMessage,
    s.regenerateMessage,
    s.delAndRegenerateMessage,
    s.copyMessage,
    s.openThreadCreator,
    s.resendThreadMessage,
    s.delAndResendThreadMessage,
    s.toggleMessageEditing
  ])
  const { message } = App.useApp()

  const handleActionClick = useCallback(
      async action => {
        switch (action.key) {
          case "edit": {
            toggleMessageEditing(id, true)
          }
        }
        if (!item) return

        switch (action.key) {
          case "copy": {
            await copyMessage(id, item.content)
            message.success(t("copySuccess", { defaultValue: "Copy Success" }))
            break
          }
          case "branching": {
            openThreadCreator(id)
            break
          }

          case "del": {
            deleteMessage(id)
            break
          }

          case "regenerate": {
            if (inPortalThread) {
              resendThreadMessage(id)
            } else regenerateMessage(id)

            // if this message is an error message, we need to delete it
            if (item.error) deleteMessage(id)
            break
          }

          case "delAndRegenerate": {
            if (inPortalThread) {
              delAndResendThreadMessage(id)
            } else {
              delAndRegenerateMessage(id)
            }
            break
          }

        }

        if (action.keyPath.at(-1) === "translate") {
          // click the menu item with translate item, the result is:
          // key: 'en-US'
          // keyPath: ['en-US','translate']
          const lang = action.keyPath[0]
          translateMessage(id, lang)
        }
      },
      [item]
  )

  const RenderFunction = renderActions[item?.role || ""] ?? ActionsBar

  return <RenderFunction {...item} onActionClick={handleActionClick} />
})

export default Actions; 