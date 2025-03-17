import { WelcomeLogo } from "@/components/Branding"
import StructuredData from "@/components/StructuredData"
import { BRANDING_NAME } from "@/const/branding"
import { ldModule } from "@/server/ld"
import { metadataModule } from "@/server/metadata"
import metadate from "@/locales/default/metadata"; // 根据实际路径调整

import Actions from "./features/Actions"
import Hero from "./features/Hero"
import Layout from './layout'

export const generateMetadata = async () => {
    return metadataModule.generate({
        description: metadate.welcome.description.replace(/appName/g, BRANDING_NAME),
        title: metadate.welcome.title.replace(/appName/g, BRANDING_NAME),
        url: "/welcome"
    })
}

const Page = async () => {

    const ld = ldModule.generate({
        description: metadate.welcome.description.replace(/appName/g, BRANDING_NAME),
        title: metadate.welcome.title,
        url: "/welcome"
    })

    return (
        <>
            <StructuredData ld={ld} />
            <WelcomeLogo />
            <Hero />
            <Actions/>
        </>
    )
}

Page.displayName = "Welcome"

export default Page
