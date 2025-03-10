import { Flexbox } from "react-layout-kit"


// import SessionPanel from "./SessionPanel"

const Layout = ({ children }) => {
    return (
        <>
            <Flexbox
                flex={1}
                style={{ overflow: "hidden", position: "relative" }}>
                {children}
            </Flexbox>
            {/* ↓ cloud slot ↓ */}

            {/* ↑ cloud slot ↑ */}
        </>
    )
}

Layout.displayName = "DesktopChatLayout"

export default Layout
