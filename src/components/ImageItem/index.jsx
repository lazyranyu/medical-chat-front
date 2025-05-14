import { ActionIcon, Image } from "@lobehub/ui"
import { createStyles } from "antd-style"
import { Trash } from "lucide-react"
import { memo } from "react"

import { usePlatform } from "@/hooks/usePlatform"

import { MIN_IMAGE_SIZE } from "./style"

const useStyles = createStyles(({ css, token }) => ({
    deleteButton: css`
        color: #fff;
        background: ${token.colorBgMask};

        &:hover {
            background: ${token.colorError};
        }
    `,
    editableImage: css`
        background: ${token.colorBgContainer};
        box-shadow: 0 0 0 1px ${token.colorFill} inset;
    `,
    image: css`
        margin-block: 0 !important;

        .ant-image {
            height: 100% !important;

            img {
                height: 100% !important;
            }
        }
    `
}))

const FileItem = memo(
    ({ editable, alt, onRemove, url, loading, alwaysShowClose }) => {
        const IMAGE_SIZE = editable ? MIN_IMAGE_SIZE : "100%"
        const { styles, cx } = useStyles()
        const { isSafari } = usePlatform()
        // 添加URL转换逻辑
        const transformedUrl = url ? url.replace('http://127.0.0.1:9005/image', '/images') : url;


        return (
            <Image
                actions={
                    editable && (
                        <ActionIcon
                            className={styles.deleteButton}
                            glass
                            icon={Trash}
                            onClick={e => {
                                e.stopPropagation()
                                onRemove?.()
                            }}
                            size={"small"}
                        />
                    )
                }
                alt={alt || ""}
                alwaysShowActions={alwaysShowClose}
                height={isSafari ? "auto" : "100%"}
                isLoading={loading}
                size={IMAGE_SIZE}
                src={transformedUrl}
                crossOrigin="anonymous"
                style={{ height: isSafari ? "auto" : "100%" }}
                wrapperClassName={cx(styles.image, editable && styles.editableImage)}
            />
        )
    }
)

export default FileItem
