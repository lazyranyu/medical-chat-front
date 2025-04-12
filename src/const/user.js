import { TopicDisplayMode } from "@/types/topic"

export const DEFAULT_PREFERENCE = {
    guide: {
        moveSettingsToAvatar: true,
        topic: true
    },
    telemetry: null,
    topicDisplayMode: TopicDisplayMode.ByTime,
    useCmdEnterToSend: false
}
