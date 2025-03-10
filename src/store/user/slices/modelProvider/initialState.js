/**
 * 模型提供商相关初始状态
 * 简化为单一模型提供商
 */
export const initialModelProviderState = {
    // 模型列表
    models: [
        {
            id: 'gpt-4',
            name: 'GPT-4',
            features: {
                upload: true,
                files: true,
            },
        },
        {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            features: {
                upload: true,
                files: false,
            },
        }
    ],
    
    // 当前选中的模型ID
    currentModelId: 'gpt-4',
};