import { Icon, Tooltip } from "@lobehub/ui"
import { Tag } from "antd"
import { createStyles } from "antd-style"
import { BoltIcon, RotateCwIcon } from "lucide-react"
import { darken, lighten } from "polished"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"

import { AsyncTaskStatus } from "@/types/asyncTask"
import components from "@/locales/default/components";
import common from "@/locales/default/common";

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
    errorReason: css`
        padding: 4px;

        font-family: monospace;
        font-size: 12px;

        background: ${isDarkMode
                ? darken(0.1, token.colorText)
                : lighten(0.1, token.colorText)};
        border-radius: 4px;
    `
}))

const EmbeddingStatus = memo(
    ({
         chunkCount,
         embeddingStatus,
         embeddingError,
         onClick,
         onErrorClick,
         className
     }) => {
        const { t } = useTranslation(["components", "common"])
        const { styles, cx } = useStyles()

        switch (embeddingStatus) {
            case AsyncTaskStatus.Processing: {
                return (
                    <Flexbox horizontal>
                        <Tooltip
                            styles={{ root: { pointerEvents: "none" } }}
                            title={components.FileParsingStatus.chunks.embeddingStatus.processing}
                        >
                            <Tag
                                bordered={false}
                                className={cx("chunk-tag", className)}
                                color={"processing"}
                                icon={<Icon icon={BoltIcon} spin />}
                                style={{ cursor: "pointer" }}
                            >
                                {chunkCount}
                            </Tag>
                        </Tooltip>
                    </Flexbox>
                )
            }

            case AsyncTaskStatus.Error: {
                return (
                    <Tooltip
                        styles={{ root: { maxWidth: 340, pointerEvents: "none" } }}
                        title={
                            <Flexbox gap={4}>
                                {components.FileParsingStatus.chunks.embeddingStatus.errorResult}
                                {embeddingError && (
                                    <Flexbox className={styles.errorReason}>
                                        [{embeddingError.name}]:{" "}
                                        {embeddingError.body &&
                                        typeof embeddingError.body !== "string"
                                            ? embeddingError.body.detail
                                            : embeddingError.body}
                                    </Flexbox>
                                )}
                            </Flexbox>
                        }
                    >
                        <Tag bordered={false} className={className} color={"error"}>
                            {components.FileParsingStatus.chunks.embeddingStatus.error}{" "}
                            <Icon
                                icon={RotateCwIcon}
                                onClick={() => {
                                    onErrorClick?.("embedding")
                                }}
                                style={{ cursor: "pointer" }}
                                title={common.retry}
                            />
                        </Tag>
                    </Tooltip>
                )
            }

            case AsyncTaskStatus.Success: {
                return (
                    <Flexbox horizontal>
                        <Tooltip
                            styles={{ root: { pointerEvents: "none" } }}
                            title={components.FileParsingStatus.chunks.embeddingStatus.success}
                        >
                            <Tag
                                bordered={false}
                                className={cx("chunk-tag", className)}
                                color={"purple"}
                                icon={<Icon icon={BoltIcon} />}
                                onClick={() => {
                                    onClick?.(AsyncTaskStatus.Success)
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {chunkCount}
                            </Tag>
                        </Tooltip>
                    </Flexbox>
                )
            }
        }
    }
)

export default EmbeddingStatus
