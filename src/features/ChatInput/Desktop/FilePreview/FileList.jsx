import { createStyles } from "antd-style"
import { lighten } from "polished"
import {memo, useEffect} from "react"
import { Flexbox } from "react-layout-kit"

import { fileChatSelectors, useFileStore } from "@/store/file"

import FileItem from "./FileItem"

const useStyles = createStyles(({ css, token }) => ({
    container: css`
    overflow-x: scroll;

    width: 100%;

    background: ${lighten(0.01, token.colorBgLayout)};
    border-start-start-radius: 8px;
    border-start-end-radius: 8px;
  `
}))

const FileList = memo(() => {
    const inputFilesList = useFileStore(fileChatSelectors.chatUploadFileList);
    const showFileList = useFileStore(fileChatSelectors.chatUploadFileListHasItem);
    
    // 调试输出文件列表
    useEffect(() => {
        if (inputFilesList.length > 0) {
            console.log('文件列表:', inputFilesList);
        }
    }, [inputFilesList]);

    const { styles } = useStyles()
    if (!inputFilesList.length) return null

    return (
        <Flexbox
            className={styles.container}
            gap={6}
            horizontal
            padding={showFileList ? "16px 16px 12px" : 0}
        >
            {inputFilesList.map(item => (
                <FileItem key={item.id} {...item} />
            ))}
        </Flexbox>
    )
})

export default FileList
