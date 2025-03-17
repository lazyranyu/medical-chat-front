// 假设这些是默认值或常量
import { appEnv } from '@/config/app';

const BASE_PATH = appEnv.NEXT_PUBLIC_BASE_PATH;
const noManifest = !!BASE_PATH
const BRANDING_NAME = "智能医学问答" // 替换为实际的品牌名称
const OFFICIAL_URL = "https://你的官方网址.com" // 替换为实际的官方URL
const OG_URL = "https://你的og网址.com/image.png" // 替换为实际的Open Graph URL

export const generateMetadata = async () => {
    // 假设不再需要翻译功能，直接使用字符串
    const description = `智能医学问答，回答 你的一切医学问题`
    const title = `智能医学问答`

    return {
        alternates: {
            canonical: OFFICIAL_URL
        },
        appleWebApp: {
            statusBarStyle: "black-translucent",
            title: BRANDING_NAME
        },
        description: description,
        icons: {
            apple: "/apple-touch-icon.png?v=1",
            icon: "/favicon.ico",
            shortcut: "/favicon-32x32.ico"
        },
        manifest: noManifest ? undefined : "/manifest.json",
        metadataBase: new URL(OFFICIAL_URL),
        openGraph: {
            description: description,
            images: [
                {
                    alt: title,
                    height: 640,
                    url: OG_URL,
                    width: 1200
                }
            ],
            locale: "zh-CN",
            siteName: BRANDING_NAME,
            title: BRANDING_NAME,
            type: "website",
            url: OFFICIAL_URL
        },
        title: {
            default: title,
            template: `%s · ${BRANDING_NAME}`
        },
        twitter: {
            card: "summary_large_image",
            description: description,
            images: [OG_URL],
            site: "@lobehub",
            title: title
        }
    }
}
