import { DEFAULT_PREFERENCE } from "@/const/user"

const useCmdEnterToSend = s => s.preference.useCmdEnterToSend || false
const topicDisplayMode = s =>
    s.preference.topicDisplayMode || DEFAULT_PREFERENCE.topicDisplayMode

const userAllowTrace = s => s.preference.telemetry

const hideSyncAlert = s => s.preference.hideSyncAlert

const hideSettingsMoveGuide = s => s.preference.guide?.moveSettingsToAvatar

const showUploadFileInKnowledgeBaseTip = s =>
    s.preference.guide?.uploadFileInKnowledgeBase

const shouldTriggerFileInKnowledgeBaseTip = s =>
    !(typeof s.preference.guide?.moveSettingsToAvatar === "boolean")

const isPreferenceInit = s => s.isUserStateInit

export const preferenceSelectors = {
    hideSettingsMoveGuide,
    hideSyncAlert,
    isPreferenceInit,
    shouldTriggerFileInKnowledgeBaseTip,
    showUploadFileInKnowledgeBaseTip,
    topicDisplayMode,
    useCmdEnterToSend,
    userAllowTrace
}
