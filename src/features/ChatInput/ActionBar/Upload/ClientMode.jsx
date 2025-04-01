import { ActionIcon } from '@lobehub/ui';
import { Upload } from 'antd';
import { FileUp, LucideImage } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAgentStore, agentSelectors } from '@/store/agent';
import { useFileStore } from '@/store/file';
import { useUserStore } from '@/store/user';
import { modelProviderSelectors } from '@/store/user/selectors';
import chat from "@/locales/default/chat";
// 静态配置项
const staticModel = 'gpt-4'; // 模拟当前使用的模型
const staticCanUpload = true; // 模拟上传权限
const staticEnabledFiles = true; // 模拟文件功能启用状态
const staticUploadFiles = async (files) => {
    console.log('Files uploaded (mock):', files);
    // 这里可以添加模拟文件上传逻辑
};
const FileUpload = memo(() => {
    // 使用稳定的选择器获取上传函数
    const upload = useFileStore((s) => s.uploadChatFiles);

    // 使用静态模型值
    const model = 'gpt-4';
    const canUpload = true;
    const enabledFiles = true;

    return (
        <Upload
            accept={ 'image/*'}
            beforeUpload={async (file) => {
                await upload([file]);

                return false;
            }}
            disabled={!canUpload}
            multiple={true}
            showUploadList={false}
        >
            <ActionIcon
                disable={!canUpload}
                icon={enabledFiles ? FileUp : LucideImage}
                placement={'bottom'}
                title={chat.upload.action.imageUpload}
            />
        </Upload>
    );
});

export default FileUpload;
