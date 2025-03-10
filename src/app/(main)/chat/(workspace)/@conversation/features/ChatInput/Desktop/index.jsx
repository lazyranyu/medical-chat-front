"use client"
import { memo, useMemo } from "react"

import DesktopChatInput from "@/features/ChatInput/Desktop"
import { useGlobalStore } from "@/store/global"
import { systemStatusSelectors } from "@/store/global/selectors"

import Footer from "./Footer"
import TextArea from "./TextArea"

const leftActions = [
    "fileUpload",
    // "stt",
]

const rightActions = ["clear"]

const renderTextArea = onSend => <TextArea onSend={onSend} />
const renderFooter = ({ expand, onExpandChange }) => (
    <Footer expand={expand} onExpandChange={onExpandChange} />
)
const Desktop = memo(() => {
    // 使用useMemo包装选择器函数，避免每次渲染创建新的函数引用
    const selector = useMemo(() => (s) => systemStatusSelectors.inputHeight(s), []);
    
    // 使用单个选择器而不是数组，避免在服务器端渲染时出现问题
    const inputHeight = useGlobalStore(selector);
    
    // 获取updateSystemStatus方法
    const updateSystemStatus = useGlobalStore(useMemo(() => (s) => s.updateSystemStatus, []));
    
    return (
        <DesktopChatInput
            inputHeight={inputHeight}
            leftActions={leftActions}
            onInputHeightChange={height => {
                updateSystemStatus({ inputHeight: height })
            }}
            renderFooter={renderFooter}
            renderTextArea={renderTextArea}
            rightActions={rightActions}
        />
    )
})

export default Desktop
