import { ActionIcon } from "@lobehub/ui"
import { Typography } from "antd"
import { createStyles } from "antd-style"
import { Trash2Icon } from "lucide-react"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Center, Flexbox } from "react-layout-kit"

import { useFileStore, fileStableSelectors } from "@/store"

import UploadDetail from "../../../components/UploadDetail"
import Content from "./Content"
import { FILE_ITEM_SIZE } from "./style"

const useStyles = createStyles(({ css, token }) => ({
    actions: css`
    position: absolute;
    z-index: 10;
    inset-block-start: -4px;
    inset-inline-end: -4px;

    background: ${token.colorBgElevated};
    border-radius: 5px;
    box-shadow: 0 0 0 0.5px ${token.colorFillSecondary} inset,
      ${token.boxShadowTertiary};
  `,
    container: css`
    position: relative;

    width: ${FILE_ITEM_SIZE}px;
    min-width: ${FILE_ITEM_SIZE}px;
    height: ${FILE_ITEM_SIZE}px;

    background: ${token.colorBgContainer};
    border-radius: 8px;
  `,
    image: css`
    margin-block: 0 !important;
  `,
    status: css`
    &.ant-tag {
      padding-inline: 0;
      background: none;
    }
  `
}))

const spacing = 8
// // 文件顶部添加静态方法
// const staticRemoveChatUploadFile = (id) => {
//     console.log(`Mock remove file: ${id}`);
//     // 可扩展模拟删除逻辑
// };

const FileItem = memo(props => {
    const { file, uploadState, status, id, tasks } = props
    const { t } = useTranslation(["chat", "common"])
    const { styles } = useStyles()
    
    // 使用稳定的选择器获取删除函数
    const removeChatUploadFile = useFileStore(fileStableSelectors.getRemoveChatUploadFile)
    
    // 替换原有状态获取
    // const [removeChatUploadFile] = [staticRemoveChatUploadFile];

    return (
        <Flexbox className={styles.container} distribution={"space-between"}>
            <Center flex={1} height={FILE_ITEM_SIZE - 46} padding={spacing}>
                <Content {...props} />
            </Center>
            <Flexbox gap={4} style={{ paddingBottom: 4, paddingInline: spacing }}>
                <Typography.Text ellipsis={{ tooltip: true }} style={{ fontSize: 12 }}>
                    {file?.name || '未命名文件'}
                </Typography.Text>

                <UploadDetail
                    size={file?.size || 0}
                    status={status}
                    tasks={tasks}
                    uploadState={uploadState}
                />
            </Flexbox>
            <Flexbox className={styles.actions}>
                <ActionIcon
                    color={"red"}
                    icon={Trash2Icon}
                    onClick={() => {
                        removeChatUploadFile(id)
                    }}
                    size={"small"}
                    title={t("delete", { ns: "common" })}
                />
            </Flexbox>
        </Flexbox>
    )
})

export default FileItem
