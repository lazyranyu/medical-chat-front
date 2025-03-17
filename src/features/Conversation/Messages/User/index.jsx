import { memo, useMemo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';

import BubblesLoading from '@/components/BubblesLoading';
import { LOADING_FLAT } from '@/const/message';

import ImageFileListViewer from './ImageFileListViewer';

export const UserMessage = memo(({ id, editableContent, content, files, ...res }) => {
  if (content === LOADING_FLAT) return <BubblesLoading />;

  // 添加调试日志
  useEffect(() => {
    if (files && files.length > 0) {
      console.log('UserMessage 接收到的文件:', files);
    }
  }, [files]);

  // 处理文件列表，提取图片文件
  const imageList = useMemo(() => {
    // 如果没有files，使用res.imageList
    if (!files || files.length === 0) {
      return res.imageList || [];
    }
    
    // 过滤出图片文件并确保有URL
    const images = files.filter(file => 
      file.type && file.type.startsWith('image') && file.url
    ).map(file => ({
      id: file.id || Date.now() + Math.random(),
      name: file.name || '图片',
      url: file.url,
      type: file.type || 'image/jpeg',
      size: file.size || 0
    }));
    
    console.log('UserMessage 处理后的图片列表:', images);
    return images;
  }, [files, res.imageList]);

  return (
    <Flexbox gap={8} id={id}>
      {editableContent}
      {imageList && imageList.length > 0 && (
        <>
          <div style={{ marginTop: 8 }}></div>
          <ImageFileListViewer items={imageList} />
        </>
      )}
    </Flexbox>
  );
});

export * from './BelowMessage';
export { MarkdownRender as UserMarkdownRender } from './MarkdownRender'; 