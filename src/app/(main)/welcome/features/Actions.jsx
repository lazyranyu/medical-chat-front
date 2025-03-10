"use client";

import {Icon} from "@lobehub/ui"
import {Button} from "antd"
import {SendHorizonal} from "lucide-react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {memo, useState} from "react"
import {useTranslation} from "react-i18next"
import {Flexbox} from "react-layout-kit"
import welcome from "@/locales/default/welcome";
import {LoginModal} from "@/components/login/LoginModal";
import {RegisterModal} from "@/components/register/RegisterModal";

// import {
//     featureFlagsSelectors,
//     useServerConfigStore
// } from "@/store/serverConfig"

const Actions = memo(({mobile}) => {
    const {t} = useTranslation("welcome");
    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const router = useRouter()
    //const { showMarket } = useServerConfigStore(featureFlagsSelectors)

    return (
        <Flexbox
            gap={16}
            horizontal={!mobile}
            justify={"center"}
            width={"100%"}
            wrap={"wrap"}
        >
            <Button
                block={mobile}
                onClick={() => setRegisterVisible(true)}
                size={"large"}
                style={{minWidth: 160}}
                type={"default"}
            >
                {welcome.button.register}
            </Button>
            <Button
                block={mobile}
                onClick={() => setLoginVisible(true)}
                size={"large"}
                style={{minWidth: 160}}
                type={"primary"}
            >
                <Flexbox align={"center"} gap={4} horizontal justify={"center"}>
                    {welcome.button.login}
                    <Icon icon={SendHorizonal}/>
                </Flexbox>
            </Button>
            <RegisterModal
                open={registerVisible}
                onClose={() => setRegisterVisible(false)}
            />
            <LoginModal
                open={loginVisible}
                onClose={() => setLoginVisible(false)}
            />
        </Flexbox>
    )
})

export default Actions
