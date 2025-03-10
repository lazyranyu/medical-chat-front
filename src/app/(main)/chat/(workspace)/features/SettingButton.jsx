"use client"

import { ActionIcon } from "@lobehub/ui"
import { AlignJustify } from "lucide-react"
import { memo } from "react"
import { useTranslation } from "react-i18next"

import {
    DESKTOP_HEADER_ICON_SIZE
} from "@/const/layoutTokens"
// import { useOpenChatSettings } from "@/hooks/useInterceptingRoutes"
// import common from "@/locales/default/common";
import setting from "@/locales/default/setting";

const SettingButton = memo(() => {
    // const { t } = useTranslation("common")
    // const openChatSettings = useOpenChatSettings()

    function openChatSettings() {
        console.log('openChatSettings')
    }

    return (
        <ActionIcon
            icon={AlignJustify}
            onClick={() => openChatSettings()}
            size={DESKTOP_HEADER_ICON_SIZE}
            // title={t("header.session", { ns: "setting" })}
            title={setting.header.session}
        />
    )
})

export default SettingButton
