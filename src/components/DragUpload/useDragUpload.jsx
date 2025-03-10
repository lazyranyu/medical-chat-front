/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react"

const DRAGGING_ROOT_ID = "dragging-root"

/**
 * 获取拖拽根容器元素。
 * @returns {HTMLElement|null} 返回ID为`dragging-root`的DOM元素，如果不存在则返回null。
 */
export const getContainer = () => document.querySelector(`#${DRAGGING_ROOT_ID}`)

/**
 * 处理拖拽悬停事件，阻止默认行为以允许文件拖拽。
 * @param {DragEvent} e - 拖拽事件对象。
 */
const handleDragOver = e => {
    if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return

    const isFile = e.dataTransfer.types.includes("Files")
    if (isFile) {
        e.preventDefault()
    }
}

/**
 * 递归处理文件或目录条目，返回包含所有文件的数组。
 * @param {FileSystemEntry} entry - 文件系统条目（文件或目录）。
 * @returns {Promise<File[]>} 返回一个Promise，解析为包含所有文件的数组。
 */
const processEntry = async entry => {
    return new Promise(resolve => {
        if (entry.isFile) {
            entry.file(file => {
                resolve([file])
            })
        } else if (entry.isDirectory) {
            const dirReader = entry.createReader()
            dirReader.readEntries(async entries => {
                const filesPromises = entries.map(element => processEntry(element))
                const fileArrays = await Promise.all(filesPromises)
                resolve(fileArrays.flat())
            })
        } else {
            resolve([])
        }
    })
}

/**
 * 从DataTransferItems中提取文件列表，支持嵌套目录。
 * @param {DataTransferItemList} items - DataTransferItems对象。
 * @returns {Promise<File[]>} 返回一个Promise，解析为包含所有文件的数组。
 */
const getFileListFromDataTransferItems = async items => {
    // 遍历DataTransferItems并处理每个条目
    const filePromises = []
    for (const item of items) {
        if (item.kind === "file") {
            const entry = item.webkitGetAsEntry()
            if (entry) {
                filePromises.push(processEntry(entry))
            } else {
                const file = item.getAsFile()

                if (file)
                    filePromises.push(
                        new Promise(resolve => {
                            resolve([file])
                        })
                    )
            }
        }
    }

    const fileArrays = await Promise.all(filePromises)
    return fileArrays.flat()
}

/**
 * 自定义Hook，用于处理文件拖拽上传和粘贴上传功能。
 * @param {Function} onUploadFiles - 文件上传回调函数，接收文件数组作为参数。
 * @returns {boolean} 返回当前是否处于拖拽状态。
 */
export const useDragUpload = onUploadFiles => {
    const [isDragging, setIsDragging] = useState(false)
    // 使用计数器解决拖拽离开时误触发dragleave的问题
    const dragCounter = useRef(0)

    /**
     * 处理拖拽进入事件，更新拖拽状态。
     * @param {DragEvent} e - 拖拽事件对象。
     */
    const handleDragEnter = e => {
        if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return

        const isFile = e.dataTransfer.types.includes("Files")
        if (isFile) {
            dragCounter.current += 1
            e.preventDefault()
            setIsDragging(true)
        }
    }

    /**
     * 处理拖拽离开事件，更新拖拽状态。
     * @param {DragEvent} e - 拖拽事件对象。
     */
    const handleDragLeave = e => {
        if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return

        const isFile = e.dataTransfer.types.includes("Files")
        if (isFile) {
            e.preventDefault()

            // 更新计数器
            dragCounter.current -= 1

            if (dragCounter.current === 0) {
                setIsDragging(false)
            }
        }
    }

    /**
     * 处理文件拖拽释放事件，提取文件并触发上传回调。
     * @param {DragEvent} e - 拖拽事件对象。
     */
    const handleDrop = async e => {
        if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return

        const isFile = e.dataTransfer.types.includes("Files")
        if (!isFile) return

        e.preventDefault()

        // 重置计数器
        dragCounter.current = 0

        setIsDragging(false)
        const items = Array.from(e.dataTransfer?.items)

        const files = await getFileListFromDataTransferItems(items)

        if (files.length === 0) return

        // 触发文件上传回调
        onUploadFiles(files)
    }

    /**
     * 处理粘贴事件，提取剪贴板中的文件并触发上传回调。
     * @param {ClipboardEvent} event - 粘贴事件对象。
     */
    const handlePaste = async event => {
        // 从剪贴板中获取文件
        if (!event.clipboardData) return
        const items = Array.from(event.clipboardData?.items)

        const files = await getFileListFromDataTransferItems(items)
        if (files.length === 0) return

        onUploadFiles(files)
    }

    useEffect(() => {
        if (getContainer()) return
        const root = document.createElement("div")
        root.id = DRAGGING_ROOT_ID
        document.body.append(root)

        return () => {
            root.remove()
        }
    }, [])

    useEffect(() => {
        window.addEventListener("dragenter", handleDragEnter)
        window.addEventListener("dragover", handleDragOver)
        window.addEventListener("dragleave", handleDragLeave)
        window.addEventListener("drop", handleDrop)
        window.addEventListener("paste", handlePaste)

        return () => {
            window.removeEventListener("dragenter", handleDragEnter)
            window.removeEventListener("dragover", handleDragOver)
            window.removeEventListener("dragleave", handleDragLeave)
            window.removeEventListener("drop", handleDrop)
            window.removeEventListener("paste", handlePaste)
        }
    }, [
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handlePaste
    ])

    return isDragging
}
