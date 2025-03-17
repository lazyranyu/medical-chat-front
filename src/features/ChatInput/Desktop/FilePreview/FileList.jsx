import { createStyles } from "antd-style"
import { lighten } from "polished"
import {memo, useEffect} from "react"
import { Flexbox } from "react-layout-kit"

import { fileStableSelectors, useFileStore } from "@/store"

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
    // 使用稳定的选择器获取文件列表
    const inputFilesList = useFileStore(fileStableSelectors.getChatUploadFileList)
    // 判断是否有文件
    const showFileList = inputFilesList.length > 0
    
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
