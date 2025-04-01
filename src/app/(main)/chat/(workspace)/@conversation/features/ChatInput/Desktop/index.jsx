"use client"
import { memo, useMemo } from "react"

import DesktopChatInput from "@/features/ChatInput/Desktop"
import { useGlobalStore } from "@/store/global"
import { systemStatusSelectors } from "@/store/global/selectors"

import Footer from "./Footer"
import TextArea from "./TextArea"
import {generalActionSlice} from "@/store/global/actions/general";

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
    const [inputHeight, updatePreference] = useGlobalStore((s) => [
        systemStatusSelectors.inputHeight(s),
        s.updateSystemStatus,
    ]);
    return (
        <DesktopChatInput
            inputHeight={inputHeight}
            leftActions={leftActions}
            onInputHeightChange={(height) => {
                updatePreference({ inputHeight: height });
            }}
            renderFooter={renderFooter}
            renderTextArea={renderTextArea}
            rightActions={rightActions}
        />
    )
})

export default Desktop
