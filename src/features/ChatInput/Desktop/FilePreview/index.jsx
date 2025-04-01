import { memo } from "react"

import DragUpload from "@/components/DragUpload"
// import { useAgentStore } from '@/store/agent';
// import { agentSelectors } from '@/store/agent';
import { useFileStore } from '@/store/file';
// import { useUserStore } from '@/store/user';
// import { modelProviderSelectors } from '@/store/user/selectors';

import FileItemList from "./FileList"

const FilePreview = memo(() => {
    // 注释掉动态获取模型的代码
    // const model = useAgentStore(agentSelectors.currentAgentModel);
    // const canUploadImage = useUserStore(modelProviderSelectors.isModelEnabledUpload(model));
    
    // 直接从useFileStore中获取uploadChatFiles函数
    const uploadFiles = useFileStore(state => state.uploadChatFiles);

    // 使用静态变量代替状态管理
    const model = "gpt-4" // 替代 useAgentStore(agentSelectors.currentAgentModel)
    const canUploadImage = true // 替代 useUserStore(modelProviderSelectors.isModelEnabledUpload(model))

    // // 模拟文件上传函数
    // const uploadFiles = files => {
    //     console.log("Uploaded files:", files)
    // }

    const upload = async fileList => {
        if (!fileList || fileList.length === 0) return

        console.log('准备上传文件:', fileList);

        // Filter out files that are not images if the model does not support image uploads
        const files = Array.from(fileList).filter(file => {
            if (canUploadImage) return true

            return !file.type.startsWith("image")
        })

        console.log('过滤后的文件:', files);
        
        try {
            const result = await uploadFiles(files);
            console.log('上传结果:', result);
        } catch (error) {
            console.error('上传文件失败:', error);
        }
    }

    return (
        <>
            <DragUpload onUploadFiles={upload} />
            <FileItemList />
        </>
    )
})

export default FilePreview
