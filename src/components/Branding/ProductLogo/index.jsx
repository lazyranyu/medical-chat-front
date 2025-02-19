import { LobeChat } from "@lobehub/ui/brand"
import { memo } from "react"

import { isCustomBranding } from "@/const/version"

import CustomLogo from "./Custom"

export const ProductLogo = memo(props => {
    if (isCustomBranding) {
        return <CustomLogo {...props} />
    }

    return <LobeChat {...props} />
})
