import { getCanonicalUrl } from "@/server/utils/url"

import Client from "./(loading)/Client"
import Redirect from "./(loading)/Redirect"

export const metadata = {
    alternates: { canonical: getCanonicalUrl("/") }
}

const Page = () => {
    return (
        <>
            <Client />
            <Redirect />
        </>
    )
}

Page.displayName = "Loading"

export default Page
