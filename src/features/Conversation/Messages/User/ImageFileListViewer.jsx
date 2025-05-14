import { ImageGallery } from "@lobehub/ui"
import { memo } from "react"

import GalleyGrid from "@/components/GalleyGrid"
import ImageItem from "@/components/ImageItem"

const ImageFileListViewer = memo(({ items }) => {
    return (
        <ImageGallery>
            <GalleyGrid items={items} renderItem={ImageItem} />
        </ImageGallery>
    )
})

export default ImageFileListViewer
