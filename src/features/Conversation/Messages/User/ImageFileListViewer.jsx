import { ImageGallery } from "@lobehub/ui"
import { memo, useEffect, useMemo } from "react"

import GalleyGrid from "@/components/GalleyGrid"
import ImageItem from "@/components/ImageItem"

const ImageFileListViewer = memo(({ items }) => {
    useEffect(() => {
        console.log('ImageFileListViewer 接收到的图片列表:', items);
    }, [items]);
    
    const validItems = useMemo(() => {
        if (!items || !Array.isArray(items)) {
            console.error('ImageFileListViewer: items不是数组', items);
            return [];
        }
        
        const filtered = items.filter(item => {
            if (!item || !item.url) {
                console.warn('ImageFileListViewer: 过滤掉无效的图片项', item);
                return false;
            }
            return true;
        });
        
        console.log('ImageFileListViewer: 有效的图片项数量', filtered.length);
        return filtered;
    }, [items]);
    
    if (!validItems || validItems.length === 0) {
        console.log('ImageFileListViewer: 没有有效的图片项');
        return null;
    }
    
    return (
        <ImageGallery>
            <GalleyGrid items={validItems} renderItem={ImageItem} />
        </ImageGallery>
    )
})

export default ImageFileListViewer
