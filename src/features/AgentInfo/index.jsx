import { Avatar, Markdown, Tag } from "@lobehub/ui"
import { Divider } from "antd"
import { createStyles } from "antd-style"
import { startCase } from "lodash-es"
import { memo } from "react"
import { Center } from "react-layout-kit"

const useStyles = createStyles(({ css, token }) => ({
    avatar: css`
        flex: none;
    `,
    desc: css`
        color: ${token.colorTextDescription};
        text-align: center;
    `,
    title: css`
        font-size: 20px;
        font-weight: 600;
        text-align: center;
    `
}))

const AgentInfo = memo(({ systemRole, style, meta, onAvatarClick }) => {
    const { styles, theme } = useStyles()

    if (!meta) return

    return (
        <Center gap={16} style={style}>
            {meta.avatar && (
                <Avatar
                    animation
                    avatar={meta.avatar}
                    background={meta.backgroundColor || theme.colorFillTertiary}
                    className={styles.avatar}
                    onClick={onAvatarClick}
                    size={100}
                />
            )}
            {meta.title && <div className={styles.title}>{meta.title}</div>}
            {meta?.tags?.length > 0 && (
                <Center gap={6} horizontal style={{ flexWrap: "wrap" }}>
                    {meta.tags.map((tag, index) => (
                        <Tag key={index} style={{ margin: 0 }}>
                            {startCase(tag).trim()}
                        </Tag>
                    ))}
                </Center>
            )}
            {meta.description && (
                <div className={styles.desc}>{meta.description}</div>
            )}
            {systemRole && (
                <>
                    <Divider style={{ margin: "8px 0" }} />
                    <Markdown variant={"chat"}>{systemRole}</Markdown>
                </>
            )}
        </Center>
    )
})

export default AgentInfo
