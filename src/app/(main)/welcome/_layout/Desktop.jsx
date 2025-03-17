import { Flexbox } from "react-layout-kit"

import { ORG_NAME } from "@/const/branding"
import { isCustomORG } from "@/const/version"
import Follow from "@/features/Follow"
import GridShowcaseClient from "./GridShowcaseClient"
import YearDisplay from "./YearDisplay"

// 使用固定年份或在客户端渲染时设置

const DesktopLayout = ({ children }) => {
    return (
        <>
            <Flexbox
                align={"center"}
                height={"100%"}
                justify={"space-between"}
                padding={16}
                style={{ overflow: "hidden", position: "relative" }}
                width={"100%"}
            >
                <div />
                <GridShowcaseClient
                    innerProps={{ gap: 24 }}
                    style={{ maxHeight: "calc(100% - 104px)", maxWidth: 1024 }}
                    width={"100%"}
                >
                    {children}
                </GridShowcaseClient>
                <Flexbox align={"center"} horizontal justify={"space-between"}>
                    <YearDisplay orgName={ORG_NAME} />
                    {isCustomORG ? <div /> : <Follow />}
                </Flexbox>
            </Flexbox>
            {/* ↓ cloud slot ↓ */}

            {/* ↑ cloud slot ↑ */}
        </>
    )
}

export default DesktopLayout
