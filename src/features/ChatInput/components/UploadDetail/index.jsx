import { Typography } from "antd"
import { createStyles } from "antd-style"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"

import FileParsingStatus from "@/components/FileParsingStatus"

import UploadStatus from "./UploadStatus"
import chat from "@/locales/default/chat";

const useStyles = createStyles(({ css }) => ({
    status: css`
    &.ant-tag {
      padding-inline: 0;
      background: none;
    }
  `
}))

const UploadDetail = memo(({ uploadState, status, size, tasks }) => {
    const { styles } = useStyles()

    return (
        <Flexbox align={"center"} gap={8} height={22} horizontal>
            <UploadStatus size={size} status={status} uploadState={uploadState} />
            {!!tasks && Object.keys(tasks).length === 0 ? (
                <Typography.Text style={{ fontSize: 12 }} type={"secondary"}>
                    {chat.upload.preview.prepareTasks}
                </Typography.Text>
            ) : (
                <div>
                    <FileParsingStatus
                        {...tasks}
                        className={styles.status}
                        hideEmbeddingButton
                    />
                </div>
            )}
        </Flexbox>
    )
})

export default UploadDetail
