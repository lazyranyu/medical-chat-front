'use client'
import { createStyles, useTheme } from "antd-style"
import Image from "next/image"
import { memo } from "react"
import { Flexbox } from "react-layout-kit"

import { BRANDING_LOGO_URL, BRANDING_NAME } from "@/const/branding"

const useStyles = createStyles(({ css }) => {
    return {
        extraTitle: css`
            font-weight: 300;
            white-space: nowrap;
        `
    }
})

const CustomTextLogo = memo(({ size, style, ...rest }) => {
    return (
        <Flexbox
            height={size}
            style={{
                fontSize: size / 1.5,
                fontWeight: "bolder",
                userSelect: "none",
                ...style
            }}
            {...rest}
        >
            {BRANDING_NAME}
        </Flexbox>
    )
})

const CustomImageLogo = memo(({ size, ...rest }) => {
    return (
        <Image
            alt={BRANDING_NAME}
            height={size}
            src={BRANDING_LOGO_URL}
            unoptimized={true}
            width={size}
            {...rest}
        />
    )
})

const Divider = memo(({ size = "1em", style, ...rest }) => (
    <svg
        fill="none"
        height={size}
        shapeRendering="geometricPrecision"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flex: "none", lineHeight: 1, ...style }}
        viewBox="0 0 24 24"
        width={size}
        {...rest}
    >
        <path d="M16.88 3.549L7.12 20.451" />
    </svg>
))

const CustomLogo = memo(
    ({ extra, size = 32, className, style, type, ...rest }) => {
        const theme = useTheme()
        const { styles } = useStyles()
        let logoComponent

        switch (type) {
            case "3d":
            case "flat": {
                logoComponent = <CustomImageLogo size={size} style={style} {...rest} />
                break
            }
            case "mono": {
                logoComponent = (
                    <CustomImageLogo
                        size={size}
                        style={{ filter: "grayscale(100%)", ...style }}
                        {...rest}
                    />
                )
                break
            }
            case "text": {
                logoComponent = <CustomTextLogo size={size} style={style} {...rest} />
                break
            }
            case "combine": {
                logoComponent = (
                    <>
                        <CustomImageLogo size={size} />
                        <CustomTextLogo
                            size={size}
                            style={{ marginLeft: Math.round(size / 4) }}
                        />
                    </>
                )

                if (!extra)
                    logoComponent = (
                        <Flexbox align={"center"} flex={"none"} horizontal {...rest}>
                            {logoComponent}
                        </Flexbox>
                    )

                break
            }
        }

        if (!extra) return logoComponent

        const extraSize = Math.round((size / 3) * 1.9)

        return (
            <Flexbox
                align={"center"}
                className={className}
                flex={"none"}
                horizontal
                {...rest}
            >
                {logoComponent}
                <Divider size={extraSize} style={{ color: theme.colorFill }} />
                <div className={styles.extraTitle} style={{ fontSize: extraSize }}>
                    {extra}
                </div>
            </Flexbox>
        )
    }
)

export default CustomLogo
