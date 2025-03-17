import { ModelIcon, ProviderIcon } from "@lobehub/icons"
import { Icon, Tooltip } from "@lobehub/ui"
import { Typography } from "antd"
import { createStyles } from "antd-style"
import { Infinity, LucideEye, LucidePaperclip, ToyBrick } from "lucide-react"
import numeral from "numeral"
import { rgba } from "polished"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Center, Flexbox } from "react-layout-kit"

import { formatTokenNumber } from "@/utils/format"

const useStyles = createStyles(({ css, token }) => ({
    custom: css`
    width: 36px;
    height: 20px;

    font-family: ${token.fontFamilyCode};
    font-size: 12px;
    color: ${rgba(token.colorWarning, 0.75)};

    background: ${token.colorWarningBg};
    border-radius: 4px;
  `,
    tag: css`
    cursor: default;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 20px;
    height: 20px;

    border-radius: 4px;
  `,
    tagBlue: css`
    color: ${token.geekblue};
    background: ${token.geekblue1};
  `,
    tagGreen: css`
    color: ${token.green};
    background: ${token.green1};
  `,
    token: css`
    width: 36px;
    height: 20px;

    font-family: ${token.fontFamilyCode};
    font-size: 11px;
    color: ${token.colorTextSecondary};

    background: ${token.colorFillTertiary};
    border-radius: 4px;
  `
}))

export const ModelInfoTags = memo(
    ({ directionReverse, placement = "right", ...model }) => {
        const { t } = useTranslation("components")
        const { styles, cx } = useStyles()

        return (
            <Flexbox
                direction={directionReverse ? "horizontal-reverse" : "horizontal"}
                gap={4}
            >
                {model.files && (
                    <Tooltip
                        styles={{ root: { pointerEvents: "none" } }}
                        placement={placement}
                        title={t("ModelSelect.featureTag.file")}
                    >
                        <div
                            className={cx(styles.tag, styles.tagGreen)}
                            style={{ cursor: "pointer" }}
                            title=""
                        >
                            <Icon icon={LucidePaperclip} />
                        </div>
                    </Tooltip>
                )}
                {model.vision && (
                    <Tooltip
                        styles={{ root: { pointerEvents: "none" } }}
                        placement={placement}
                        title={t("ModelSelect.featureTag.vision")}
                    >
                        <div
                            className={cx(styles.tag, styles.tagGreen)}
                            style={{ cursor: "pointer" }}
                            title=""
                        >
                            <Icon icon={LucideEye} />
                        </div>
                    </Tooltip>
                )}
                {model.functionCall && (
                    <Tooltip
                        styles={{ root: { maxWidth: "unset", pointerEvents: "none" } }}
                        placement={placement}
                        title={t("ModelSelect.featureTag.functionCall")}
                    >
                        <div
                            className={cx(styles.tag, styles.tagBlue)}
                            style={{ cursor: "pointer" }}
                            title=""
                        >
                            <Icon icon={ToyBrick} />
                        </div>
                    </Tooltip>
                )}
                {typeof model.contextWindowTokens === "number" && (
                    <Tooltip
                        styles={{ root: { maxWidth: "unset", pointerEvents: "none" } }}
                        placement={placement}
                        title={t("ModelSelect.featureTag.tokens", {
                            tokens:
                                model.contextWindowTokens === 0
                                    ? "∞"
                                    : numeral(model.contextWindowTokens).format("0,0")
                        })}
                    >
                        <Center className={styles.token} title="">
                            {model.contextWindowTokens === 0 ? (
                                <Infinity size={17} strokeWidth={1.6} />
                            ) : (
                                formatTokenNumber(model.contextWindowTokens)
                            )}
                        </Center>
                    </Tooltip>
                )}
            </Flexbox>
        )
    }
)

export const ModelItemRender = memo(({ showInfoTag = true, ...model }) => {
    return (
        <Flexbox align={"center"} gap={32} horizontal justify={"space-between"}>
            <Flexbox align={"center"} gap={8} horizontal>
                <ModelIcon model={model.id} size={20} />
                <Typography.Paragraph ellipsis={false} style={{ marginBottom: 0 }}>
                    {model.displayName || model.id}
                </Typography.Paragraph>
            </Flexbox>

            {showInfoTag && <ModelInfoTags {...model} />}
        </Flexbox>
    )
})

export const ProviderItemRender = memo(({ provider, name }) => (
    <Flexbox align={"center"} gap={4} horizontal>
        <ProviderIcon provider={provider} size={20} type={"mono"} />
        {name}
    </Flexbox>
))

export const LabelRenderer = memo(({ Icon, label }) => (
    <Flexbox align={"center"} gap={8} horizontal>
        <Icon size={20} />
        <span>{label}</span>
    </Flexbox>
))
