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
    
    // // 使用静态变量代替状态管理
    // const inputFilesList = [
    //     { id: 1, name: "file1.txt", size: "1MB" },
    //     { id: 2, name: "file2.jpg", size: "2MB" },
    //     { id: 3, name: "file3.pdf", size: "3MB" }
    // ]
    // const showFileList = true

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
