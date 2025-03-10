import { FileTypeIcon, MaterialFileTypeIcon } from "@lobehub/ui"
import { memo } from "react"

import { mimeTypeMap } from "./config"

const FileIcon = memo(({ fileName, size, variant = "file" }) => {
  if (
      Object.keys(mimeTypeMap).some(key =>
          fileName?.toLowerCase().endsWith(`.${key}`)
      )
  ) {
    const ext = fileName
        .split(".")
        .pop()
        ?.toLowerCase()

    return (
        <FileTypeIcon
            color={mimeTypeMap[ext]}
            filetype={ext?.toUpperCase()}
            size={size}
            type={"file"}
        />
    )
  }

  return (
      <MaterialFileTypeIcon
          filename={fileName}
          size={size}
          type={"file"}
          variant={variant}
      />
  )
})

export default FileIcon
