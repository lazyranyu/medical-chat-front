import { Copy, Edit, ListRestart, RotateCcw, Split, Trash } from "lucide-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import common from "@/locales/default/common";
import chat from "@/locales/default/chat";
export const useChatListActionsBar = ({ hasThread } = {}) => {
    const { t } = useTranslation("common")
    const isDeprecatedEdition = true
    return useMemo(
        () => ({
            branching: {
                disable: isDeprecatedEdition,
                icon: Split,
                key: "branching",
                label: common.branching
            },
            copy: {
                icon: Copy,
                key: "copy",
                label: common.copy
            },
            del: {
                danger: true,
                disable: hasThread,
                icon: Trash,
                key: "del",
                label: hasThread
                    ? common.messageAction.deleteDisabledByThreads
                    : common.delete
            },
            delAndRegenerate: {
                disable: hasThread,
                icon: ListRestart,
                key: "delAndRegenerate",
                label: chat.messageAction.delAndRegenerate
            },
            divider: {
                type: "divider"
            },
            edit: {
                icon: Edit,
                key: "edit",
                label: common.edit
            },
            regenerate: {
                icon: RotateCcw,
                key: "regenerate",
                label: common.regenerate
            }
        }),
        [hasThread]
    )
}
