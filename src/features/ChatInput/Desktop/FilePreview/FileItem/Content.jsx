import { Image } from "@lobehub/ui"
import { createStyles } from "antd-style"
import { memo } from "react"

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

  if (file.type.startsWith("image")) {
    return (
        <Image alt={file.name} src={previewUrl} wrapperClassName={styles.image} />
    )
  }

  if (file.type.startsWith("video")) {
    return <video className={styles.video} src={previewUrl} width={"100%"} />
  }

  return <FileIcon fileName={file?.name||'文件'} fileType={file?.type||'jpg'} size={100} />
})

export default Content
