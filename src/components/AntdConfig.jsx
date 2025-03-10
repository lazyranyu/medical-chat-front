import React from 'react';
import { ConfigProvider } from 'antd';
import CustomWave from './CustomWave';

// 自定义 Ant Design 配置，禁用波纹效果
const AntdConfig = ({ children }) => {
  return (
    <ConfigProvider
      wave={{
        // 使用自定义的 Wave 组件替代默认实现
        // 这将禁用波纹效果，避免 reactRender 错误
        WaveEffect: CustomWave,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfig; 