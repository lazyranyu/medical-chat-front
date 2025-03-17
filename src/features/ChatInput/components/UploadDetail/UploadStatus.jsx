import { CheckCircleFilled } from "@ant-design/icons"
import { Icon } from "@lobehub/ui"
import { Progress, Typography } from "antd"
import { useTheme } from "antd-style"
import { Loader2Icon } from "lucide-react"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Flexbox } from "react-layout-kit"

import { formatSize } from "@/utils/format"
import chat from "@/locales/default/chat";

const UploadStatus = memo(({ status, size, uploadState }) => {
    const theme = useTheme()

    switch (status) {
        default:
        case "pending": {
            return (
                <Flexbox align={"center"} gap={4} horizontal>
                    <Icon icon={Loader2Icon} size={{ fontSize: 12 }} spin />
                    <Typography.Text style={{ fontSize: 12 }} type={"secondary"}>
                        {chat.upload.preview.status.pending}
                    </Typography.Text>
                </Flexbox>
            )
        }

        case "uploading": {
            return (
                <Flexbox align={"center"} gap={4} horizontal>
                    <Progress percent={uploadState?.progress} size={14} type="circle" />
                    <Typography.Text style={{ fontSize: 12 }} type={"secondary"}>
                        {formatSize(size * ((uploadState?.progress || 0) / 100), 2)} /{" "}
                        {formatSize(size)}
                    </Typography.Text>
                </Flexbox>
            )
        }

        case "processing": {
            return (
                <Flexbox align={"center"} gap={4} horizontal>
                    <Progress percent={uploadState?.progress} size={14} type="circle" />
                    <Typography.Text style={{ fontSize: 12 }} type={"secondary"}>
                        {formatSize(size)} · {chat.upload.preview.status.processing}
                    </Typography.Text>
                </Flexbox>
            )
        }

        case "success": {
            return (
                <Flexbox align={"center"} gap={4} horizontal>
                    <CheckCircleFilled
                        style={{ color: theme.colorSuccess, fontSize: 12 }}
                    />
                    <Typography.Text style={{ fontSize: 12 }} type={"secondary"}>
                        {formatSize(size)}
                    </Typography.Text>
                </Flexbox>
            )
        }
    }
})

export default UploadStatus
