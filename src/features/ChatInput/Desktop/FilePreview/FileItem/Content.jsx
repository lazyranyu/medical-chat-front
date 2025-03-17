import { Image } from "@lobehub/ui"
import { createStyles } from "antd-style"
import { memo, useEffect, useState } from "react"

import FileIcon from "@/components/FileIcon"

const useStyles = createStyles(({ css }) => ({
  image: css`
    margin-block: 0 !important;
    box-shadow: none;

    img {
      object-fit: contain;
    }
  `,
  video: css`
    overflow: hidden;
    border-radius: 8px;
  `
}))

const Content = memo(({ file, previewUrl }) => {
  const { styles } = useStyles()
  const [localPreviewUrl, setLocalPreviewUrl] = useState(previewUrl)

  // 如果没有提供previewUrl，则使用file对象创建一个本地URL
  useEffect(() => {
    if (!previewUrl && file) {
      const url = URL.createObjectURL(file)
      setLocalPreviewUrl(url)
      
      // 组件卸载时释放URL
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [file, previewUrl])

  if (file?.type?.startsWith("image")) {
    return (
        <Image alt={file.name} src={localPreviewUrl || previewUrl} wrapperClassName={styles.image} />
    )
  }

  if (file?.type?.startsWith("video")) {
    return <video className={styles.video} src={localPreviewUrl || previewUrl} width={"100%"} />
  }

  return <FileIcon fileName={file?.name||'文件'} fileType={file?.type||'jpg'} size={100} />
})

export default Content
