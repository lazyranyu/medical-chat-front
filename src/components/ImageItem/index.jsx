import { ActionIcon, Image } from "@lobehub/ui"
import { createStyles } from "antd-style"
import { Trash, ImageOff } from "lucide-react"
import { memo, useState, useEffect } from "react"

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
    `,
    errorContainer: css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: ${token.colorFillTertiary};
        color: ${token.colorTextSecondary};
        font-size: 12px;
        border-radius: 8px;
        padding: 8px;
    `
}))

const FileItem = memo(
    ({ editable, alt, onRemove, url, loading, alwaysShowClose }) => {
        const IMAGE_SIZE = editable ? MIN_IMAGE_SIZE : "100%"
        const { styles, cx } = useStyles()
        const { isSafari } = usePlatform()
        const [imageError, setImageError] = useState(false)
        const [imageUrl, setImageUrl] = useState('')
        
        // 当URL变化时更新状态
        useEffect(() => {
            if (url) {
                setImageUrl(url);
                setImageError(false);
                console.log('ImageItem: URL更新', url.substring(0, 30) + '...');
            }
        }, [url]);
        
        // 处理图片加载错误
        const handleError = () => {
            console.error('图片加载失败:', imageUrl ? imageUrl.substring(0, 30) + '...' : 'undefined');
            setImageError(true);
        };
        
        // 如果URL为空或加载失败，显示占位符
        if (!imageUrl || imageError) {
            return (
                <div className={styles.errorContainer}>
                    <ImageOff size={24} style={{ marginBottom: 4 }} />
                    <span>图片无法加载</span>
                </div>
            );
        }

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
                alt={alt || "图片"}
                alwaysShowActions={alwaysShowClose}
                height={isSafari ? "auto" : "100%"}
                isLoading={loading}
                onError={handleError}
                size={IMAGE_SIZE}
                src={imageUrl}
                style={{ height: isSafari ? "auto" : "100%" }}
                wrapperClassName={cx(styles.image, editable && styles.editableImage)}
            />
        )
    }
)

export default FileItem
