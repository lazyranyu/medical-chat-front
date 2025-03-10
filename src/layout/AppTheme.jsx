"use client"
import { ConfigProvider, FontLoader, ThemeProvider } from "@lobehub/ui"
import { createStyles } from "antd-style"
import "antd/dist/reset.css"
import Image from "next/image"
import Link from "next/link"
import { memo } from "react" // 移除 useEffect

import AntdStaticMethods from "@/components/AntdStaticMethods"
import {
    LOBE_THEME_APPEARANCE,
    LOBE_THEME_NEUTRAL_COLOR,
    LOBE_THEME_PRIMARY_COLOR
} from "@/const/theme"
import { setCookie } from "@/utils/cookie"
import PropTypes from "prop-types";
import { GlobalStyle } from '@/styles';

// 删除所有与 userStore 相关的引用

const useStyles = createStyles(({ css, token }) => ({
    app: css`
    position: relative;

    overscroll-behavior: none;
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    min-height: 100dvh;
    max-height: 100dvh;

    @media (min-device-width: 576px) {
      overflow: hidden;
    }
  `,
    // scrollbar-width and scrollbar-color are supported from Chrome 121
    // https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color
    scrollbar: css`
    scrollbar-color: ${token.colorFill} transparent;
    scrollbar-width: thin;

    #lobe-mobile-scroll-container {
      scrollbar-width: none;

      ::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  `,

    // so this is a polyfill for older browsers
    scrollbarPolyfill: css`
    ::-webkit-scrollbar {
      width: 0.75em;
      height: 0.75em;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }

    :hover::-webkit-scrollbar-thumb {
      background-color: ${token.colorText};
      background-clip: content-box;
      border: 3px solid transparent;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `,
}));

const AppTheme = memo(
    ({
         children,
         defaultAppearance = 'light', // 添加默认值
         defaultPrimaryColor = '#1677FF', // 品牌蓝色
         defaultNeutralColor = '#8A8A8A', // 中性灰
         globalCDN,
         customFontURL,
         customFontFamily
     }) => {
        const { styles, cx, theme } = useStyles()

        // 删除所有 useState 和 useEffect

        return (
            <ThemeProvider
                className={cx(styles.app, styles.scrollbar, styles.scrollbarPolyfill)}
                customTheme={{
                    neutralColor: defaultNeutralColor, // 直接使用 props
                    primaryColor: defaultPrimaryColor
                }}
                defaultAppearance={defaultAppearance}
                onAppearanceChange={appearance => {
                    setCookie(LOBE_THEME_APPEARANCE, appearance)
                }}
                theme={{
                    cssVar: true,
                    token: {
                        fontFamily: customFontFamily
                            ? `${customFontFamily},${theme.fontFamily}`
                            : undefined
                    }
                }}
                themeMode={defaultAppearance} // 使用 props 值
            >
                {!!customFontURL && <FontLoader url={customFontURL} />}
                <GlobalStyle />
                <AntdStaticMethods />
                <ConfigProvider
                    config={{
                        aAs: Link,
                        imgAs: Image,
                        imgUnoptimized: true,
                        proxy: globalCDN ? "unpkg" : undefined
                    }}
                >
                    {children}
                </ConfigProvider>
            </ThemeProvider>
        )
    }
)

// 添加 PropTypes 定义
AppTheme.propTypes = {
    children: PropTypes.node,
    defaultAppearance: PropTypes.oneOf(['light', 'dark']),
    defaultPrimaryColor: PropTypes.string,
    defaultNeutralColor: PropTypes.string,
    globalCDN: PropTypes.bool,
    customFontURL: PropTypes.string,
    customFontFamily: PropTypes.string
}

export default AppTheme
