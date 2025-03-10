import { memo, useEffect, useState } from "react"

import InputArea from "@/features/ChatInput/Desktop/InputArea"
import { useSendMessage } from "@/features/ChatInput/useSend"
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { useStoreSelector } from '@/hooks/useStoreSelector';

// 静态变量定义
// const staticLoading = false // 模拟AI生成状态
// const staticInputMessage = "" // 模拟输入内容
// const staticUpdateInputMessage = message => {
//     console.log("Input updated:", message) // 替换实际的store更新逻辑
// }

const TextArea = memo(({ onSend }) => {
    // 使用useStoreSelector替代静态变量
    const loading = useStoreSelector(useChatStore, chatSelectors.isAIGenerating);
    const value = useStoreSelector(useChatStore, state => state.inputMessage);
    const updateInputMessage = useStoreSelector(useChatStore, state => state.updateInputMessage);
    const messages = useStoreSelector(useChatStore, state => state.messages);
    
    // 本地状态用于跟踪输入值
    const [localValue, setLocalValue] = useState('');
    
    // 同步本地状态和store状态
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    
    // // 修改为使用静态变量
    // const [loading, value, updateInputMessage] = [
    //     staticLoading,
    //     staticInputMessage,
    //     staticUpdateInputMessage
    // ]
    const { send: sendMessage } = useSendMessage()

    // 添加一个处理输入变化的函数，确保输入被正确更新到store
    const handleInputChange = (newValue) => {
        setLocalValue(newValue); // 更新本地状态
        updateInputMessage(newValue); // 更新store状态
    }

    // 添加一个处理发送的函数，确保发送逻辑正确执行
    const handleSend = () => {
        if (localValue.trim()) {
            try {
                // 直接使用store的sendMessage方法
                const store = useChatStore.getState();
                
                // 发送消息
                store.sendMessage({ message: localValue });
                
                // 清空本地状态
                setLocalValue('');
                
                // 调用onSend回调
                onSend?.();

                
                // 检查发送后的状态
                setTimeout(() => {
                    const newState = useChatStore.getState();
                }, 100);
            } catch (error) {
                console.error('发送消息时出错:', error);
            }
        } else {
            console.log('输入框为空，不发送消息');
        }
    }

    return (
        <InputArea
            loading={loading}
            onChange={handleInputChange}
            onSend={handleSend}
            value={localValue} // 使用本地状态
        />
    )
})

export default TextArea
