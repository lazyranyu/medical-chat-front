'use client';

import { useEffect, useState } from 'react';

const YearDisplay = ({ orgName }) => {
  // 使用状态来存储年份，初始值为空字符串
  const [year, setYear] = useState('');
  
  // 在客户端渲染时设置年份
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  
  return (
    <span style={{ opacity: 0.5 }}>
      {year ? `© ${year} ${orgName}` : ''}
    </span>
  );
};

export default YearDisplay; 