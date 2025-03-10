import { memo } from "react"
import { Center } from "react-layout-kit"

import FileIcon from "@/components/FileIcon"
// import RepoIcon from "@/components/RepoIcon"
// import { KnowledgeType } from "@/types/knowledgeBase"

const KnowledgeIcon = memo(({ type, size, fileType, name }) => {
  const repoSize = (typeof size === "object" ? size.repo : size) || 24
  const fileSize = (typeof size === "object" ? size.file : size) || 24

  // return type === KnowledgeType.KnowledgeBase ? (
  //     <Center height={repoSize} width={repoSize}>
  //       <RepoIcon size={repoSize / 1.2} />
  //     </Center>
  // ) : (
  //     <FileIcon fileName={name} fileType={fileType} size={fileSize} />
  // )
      return (<FileIcon fileName={name} fileType={fileType} size={fileSize} />)
})

export default KnowledgeIcon
