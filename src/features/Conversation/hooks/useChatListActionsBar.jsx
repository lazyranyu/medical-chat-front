import { Copy, Edit, ListRestart, RotateCcw, Split, Trash } from "lucide-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"


export const useChatListActionsBar = ({ hasThread } = {}) => {
    const { t } = useTranslation("common")
    const isDeprecatedEdition = true
    return useMemo(
        () => ({
            branching: {
                disable: isDeprecatedEdition,
                icon: Split,
                key: "branching",
                label: !isDeprecatedEdition
                    ? t("branching", { defaultValue: "Create Sub Topic" })
                    : t("branchingDisable")
            },
            copy: {
                icon: Copy,
                key: "copy",
                label: t("copy", { defaultValue: "Copy" })
            },
            del: {
                danger: true,
                disable: hasThread,
                icon: Trash,
                key: "del",
                label: hasThread
                    ? t("messageAction.deleteDisabledByThreads", { ns: "chat" })
                    : t("delete")
            },
            delAndRegenerate: {
                disable: hasThread,
                icon: ListRestart,
                key: "delAndRegenerate",
                label: t("messageAction.delAndRegenerate", {
                    defaultValue: "Delete and regenerate",
                    ns: "chat"
                })
            },
            divider: {
                type: "divider"
            },
            edit: {
                icon: Edit,
                key: "edit",
                label: t("edit", { defaultValue: "Edit" })
            },
            regenerate: {
                icon: RotateCcw,
                key: "regenerate",
                label: t("regenerate", { defaultValue: "Regenerate" })
            }
        }),
        [hasThread]
    )
}
