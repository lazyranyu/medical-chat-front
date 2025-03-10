import { ActionIcon, Icon, Tooltip } from "@lobehub/ui"
import { Button, Popconfirm } from "antd"
import { LucideGalleryVerticalEnd, LucideMessageSquarePlus } from "lucide-react"
import { memo, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import HotKeys from "@/components/HotKeys"
import { ALT_KEY, SAVE_TOPIC_KEY } from "@/const/hotkeys"
import { useActionSWR } from "@/libs/swr"
import { useChatStore } from '@/store/chat';
import { useStoreSelector } from '@/hooks/useStoreSelector';
import chat from "@/locales/default/chat"

// // 静态配置项
// const staticHasTopic = false // 模拟是否有活跃主题（true=有主题状态，false=新建状态）
// const staticOpenNewTopicOrSaveTopic = () => {
//   console.log("执行话题操作（模拟）")
//   // 这里可以添加模拟话题切换逻辑
//   // 例如：staticHasTopic = !staticHasTopic （需配合 useState 实现状态切换）
// }
const SaveTopic = memo(({ mobile }) => {
  // 使用useStoreSelector替代直接使用useChatStore
  const activeTopicId = useStoreSelector(useChatStore, state => state.activeTopicId);
  const openNewTopicOrSaveTopic = useStoreSelector(useChatStore, state => state.openNewTopicOrSaveTopic);
  
  // 计算hasTopic
  const hasTopic = !!activeTopicId;
  
  // // 替换原有的状态获取
  // const [hasTopic, openNewTopicOrSaveTopic] = [
  //   staticHasTopic,
  //   staticOpenNewTopicOrSaveTopic
  // ]
  const { mutate, isValidating } = useActionSWR(
      "openNewTopicOrSaveTopic",
      openNewTopicOrSaveTopic
  )

  const [confirmOpened, setConfirmOpened] = useState(false)

  const icon = hasTopic ? LucideMessageSquarePlus : LucideGalleryVerticalEnd
  const desc = hasTopic
      ? chat.topic.openNewTopic
      : chat.topic.saveCurrentMessages

  const hotkeys = [ALT_KEY, SAVE_TOPIC_KEY].join("+")

  useHotkeys(hotkeys, () => mutate(), {
    enableOnFormTags: true,
    preventDefault: true
  })

  if (mobile) {
    return (
        <Popconfirm
            arrow={false}
            okButtonProps={{ danger: false, type: "primary" }}
            onConfirm={() => mutate()}
            onOpenChange={setConfirmOpened}
            open={confirmOpened}
            placement={"top"}
            title={
              <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    marginBottom: "8px"
                  }}
              >
                <div
                    style={{
                      marginRight: "16px",
                      whiteSpace: "pre-line",
                      wordBreak: "break-word"
                    }}
                >
                  {hasTopic
                      ? chat.topic.checkOpenNewTopic
                      : chat.topic.checkSaveCurrentMessages}
                </div>
                <HotKeys inverseTheme={false} keys={hotkeys} />
              </div>
            }
        >
          <Tooltip>
            <ActionIcon
                aria-label={desc}
                icon={icon}
                loading={isValidating}
                onClick={() => setConfirmOpened(true)}
            />
          </Tooltip>
        </Popconfirm>
    )
  } else {
    return (
        <Tooltip title={<HotKeys desc={desc} inverseTheme keys={hotkeys} />}>
          <Button
              aria-label={desc}
              icon={<Icon icon={icon} />}
              loading={isValidating}
              onClick={() => mutate()}
          />
        </Tooltip>
    )
  }
})

export default SaveTopic
