import { Suspense } from "react"

import StructuredData from "@/components/StructuredData"
// import { serverFeatureFlags } from "@/config/featureFlags"
import { BRANDING_NAME } from "@/const/branding"
import { ldModule } from "@/server/ld"
import { metadataModule } from "@/server/metadata"
import { translation } from "@/server/translation"
// import { isMobileDevice } from "@/utils/server/responsive"

import PageTitle from "../features/PageTitle"
import metadate from "@/locales/default/metadata"; // 根据实际路径调整

export const generateMetadata = async () => {
    // const { t } = await translation("metadata")
    return metadataModule.generate({
        description: metadate.chat.description.replace(/appName/g, BRANDING_NAME),
        title: metadate.chat.title.replace(/appName/g,BRANDING_NAME),
        url: "/chat"
    })
}

const Chat = async () => {
    // const { hideDocs, showChangelog } = serverFeatureFlags()
    // const { t } = await translation("metadata")
    const ld = ldModule.generate({
        description: metadate.chat.description.replace(/appName/g, BRANDING_NAME),
        title: metadate.chat.title.replace(/appName/g,BRANDING_NAME),
        url: "/chat"
    })

    return (
        <>
            <StructuredData ld={ld} />
            <PageTitle />
            {/*/!*{showChangelog && !hideDocs && (*!/*/}
            {/*{(*/}
            {/*    <Suspense>*/}
            {/*        <Changelog />*/}
            {/*    </Suspense>*/}
            {/*)}*/}
        </>
    )
}

export default Chat
