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
const SaveTopic = memo(({ }) => {
  // 使用useStoreSelector替代直接使用useChatStore
  const activeTopicId = useStoreSelector(useChatStore, state => state.activeTopicId);

  const openNewTopicOrSaveTopic = useStoreSelector(useChatStore, state => state.openNewTopicOrSaveTopic);
  
  // 计算hasTopic
  const hasTopic = !!activeTopicId;
    console.log("hasTopic",hasTopic);

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

    return (
        <Tooltip title={<HotKeys desc={desc} inverseTheme keys={hotkeys} />} styles={{ root: {} }}>
            <Button
                aria-label={desc}
                icon={<Icon icon={icon} />}
                loading={isValidating}
                onClick={() => mutate()}
            />
        </Tooltip>
    )
})

export default SaveTopic
