import { Highlighter } from "@lobehub/ui"
import { memo } from "react"

import { useYamlArguments } from "@/hooks/useYamlArguments"

const Arguments = memo(({ arguments: args = "" }) => {
  const yaml = useYamlArguments(args)

  return (
      !!yaml && (
          <Highlighter language={"yaml"} showLanguage={false}>
            {yaml}
          </Highlighter>
      )
  )
})

export default Arguments
