/**
 * 模型相关选择器
 * 简化为单一模型提供商
 */
export const modelProviderSelectors = {
    // 获取所有模型
    models: (s) => s.models,
    
    // 获取当前模型ID
    currentModelId: (s) => s.currentModelId,
    
    // 获取当前模型
    currentModel: (s) => {
        const { models, currentModelId } = s;
        return models.find((model) => model.id === currentModelId) || models[0];
    },
    
    // 判断模型是否启用上传功能
    isModelEnabledUpload: (modelId) => (s) => {
        const { models } = s;
        const model = models.find((m) => m.id === modelId);
        return model ? model.features.upload : false;
    },
    
    // 判断模型是否启用文件功能
    isModelEnabledFiles: (modelId) => (s) => {
        const { models } = s;
        const model = models.find((m) => m.id === modelId);
        return model ? model.features.files : false;
    },
}; 