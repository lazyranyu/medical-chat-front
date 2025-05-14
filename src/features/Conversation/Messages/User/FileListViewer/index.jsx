import { memo } from "react"
import { Flexbox } from "react-layout-kit"

import FileItem from "./Item"

const FileListViewer = memo(({ items }) => {
  return (
      <Flexbox gap={8}>
        {items.map(item => (
            <FileItem key={item.id} {...item} />
        ))}
      </Flexbox>
  )
})
export default FileListViewer
