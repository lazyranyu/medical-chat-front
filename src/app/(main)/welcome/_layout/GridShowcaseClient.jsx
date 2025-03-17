'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 动态导入 GridShowcase 组件，禁用 SSR
const GridShowcase = dynamic(
  () => import('@lobehub/ui').then((mod) => mod.GridShowcase),
  { ssr: false } // 关键设置：禁用服务端渲染
);

// 加载状态组件
const LoadingFallback = () => (
  <div style={{ 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    加载中...
  </div>
);

const GridShowcaseClient = ({ children, ...props }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GridShowcase {...props}>
        {children}
      </GridShowcase>
    </Suspense>
  );
};

export default GridShowcaseClient; 