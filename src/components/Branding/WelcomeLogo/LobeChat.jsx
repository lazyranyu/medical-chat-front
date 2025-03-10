"use client"

import dynamic from "next/dynamic"
import { memo } from "react"
import { FluentEmoji } from '@lobehub/ui';
import { Center } from "react-layout-kit"

// const LogoThree = dynamic(() => import("@lobehub/ui/es/LogoThree"), {
//     ssr: false
// })
// const LogoSpline = dynamic(
//     () => import("@lobehub/ui/es/LogoThree/LogoSpline"),
//     { ssr: false }
// )

const WelcomeLogo = memo(({ mobile }) => {
    return  (
        <Center
            style={{
                height: `min(482px, 40vw)`,
                marginBottom: "-10%",
                marginTop: "-20%",
                position: "relative",
                width: `min(976px, 80vw)`
            }}
        >
            {/*<LogoSpline height={"min(482px, 40vw)"} width={"min(976px, 80vw)"} />*/}
            <FluentEmoji type={'anim'} emoji={'🧑‍⚕️'} size={350}  draggable={false}/>
        </Center>
    )
})

export default WelcomeLogo
