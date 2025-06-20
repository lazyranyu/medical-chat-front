import analyzer from "@next/bundle-analyzer"
import { withSentryConfig } from "@sentry/nextjs"
import withSerwistInit from "@serwist/next"
import ReactComponentName from "react-scan/react-component-name/webpack"

const isProd = process.env.NODE_ENV === "production"
const buildWithDocker = process.env.DOCKER === "true"
const enableReactScan = !!process.env.REACT_SCAN_MONITOR_API_KEY
const isUsePglite = process.env.NEXT_PUBLIC_CLIENT_DB === "pglite"

// if you need to proxy the api endpoint to remote server
const API_PROXY_ENDPOINT = process.env.API_PROXY_ENDPOINT || ""

const basePath = process.env.NEXT_PUBLIC_BASE_PATH

const nextConfig = {
    assetPrefix: isProd ? `${basePath}/_next/static` : '', // 生产环境静态资源前缀
    basePath: isProd ? basePath : '', // 基础路径
    trailingSlash: true, // 确保路径结尾斜杠一致性
    compress: isProd,
    experimental: {
        optimizePackageImports: [
            "emoji-mart",
            "@emoji-mart/react",
            "@emoji-mart/data",
            "@icons-pack/react-simple-icons",
            "@lobehub/ui",
            "gpt-tokenizer"
        ],
        webVitalsAttribution: ["CLS", "LCP"]
    },

    async headers() {
        return [
            {
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ],
                source: "/favicon.ico"
            },
            {
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ],
                source: "/favicon-32x32.ico"
            }
        ]
    },
    output: buildWithDocker ? "standalone" : undefined,
    reactStrictMode: true,
    redirects: async () => [
        {
            destination: "/sitemap-index.xml",
            permanent: true,
            source: "/sitemap.xml"
        },
        {
            destination: "/sitemap-index.xml",
            permanent: true,
            source: "/sitemap-0.xml"
        },
        {
            destination: "/manifest.webmanifest",
            permanent: true,
            source: "/manifest.json"
        },
        {
            destination: "/discover/assistant/:slug",
            has: [
                {
                    key: "agent",
                    type: "query",
                    value: "(?<slug>.*)"
                }
            ],
            permanent: true,
            source: "/market"
        },
        {
            destination: "/discover/assistants",
            permanent: true,
            source: "/discover/assistant"
        },
        {
            destination: "/discover/models",
            permanent: true,
            source: "/discover/model"
        },
        {
            destination: "/discover/plugins",
            permanent: true,
            source: "/discover/plugin"
        },
        {
            destination: "/discover/providers",
            permanent: true,
            source: "/discover/provider"
        },
        {
            destination: "/settings/common",
            permanent: true,
            source: "/settings"
        },
        {
            destination: "/chat",
            permanent: true,
            source: "/welcome"
        }
    ],
    rewrites: async () => [
        // due to google api not work correct in some countries
        // we need a proxy to bypass the restriction
        {
            source: '/api/:path*',
            destination: 'http://localhost:8080/api/:path*' // 修改为包含/api前缀
        },
        {
            source: '/images/:path*',
            destination: 'http://127.0.0.1:9005/image/:path*'
        }
    ],

    serverExternalPackages: ["@electric-sql/pglite"],

    webpack(config) {
        config.experiments = {
            asyncWebAssembly: true,
            layers: true
        }

        // 开启该插件会导致 pglite 的 fs bundler 被改表
        if (enableReactScan && !isUsePglite) {
            config.plugins.push(ReactComponentName({}))
        }

        // to fix shikiji compile error
        // refs: https://github.com/antfu/shikiji/issues/23
        config.module.rules.push({
            resolve: {
                fullySpecified: false
            },
            test: /\.m?js$/,
            type: "javascript/auto"
        })

        // https://github.com/pinojs/pino/issues/688#issuecomment-637763276
        config.externals.push("pino-pretty")

        config.resolve.alias.canvas = false

        return config
    }
}

const noWrapper = config => config

const withBundleAnalyzer =
    process.env.ANALYZE === "true" ? analyzer() : noWrapper

const withPWA = isProd
    ? withSerwistInit({
        register: false,
        swDest: "public/sw.js",
        swSrc: "src/app/sw.ts"
    })
    : noWrapper

const hasSentry = !!process.env.NEXT_PUBLIC_SENTRY_DSN
const withSentry =
    isProd && hasSentry
        ? c =>
            withSentryConfig(
                c,
                {
                    org: process.env.SENTRY_ORG,

                    project: process.env.SENTRY_PROJECT,
                    // For all available options, see:
                    // https://github.com/getsentry/sentry-webpack-plugin#options
                    // Suppresses source map uploading logs during build
                    silent: true
                },
                {
                    // Enables automatic instrumentation of Vercel Cron Monitors.
                    // See the following for more information:
                    // https://docs.sentry.io/product/crons/
                    // https://vercel.com/docs/cron-jobs
                    automaticVercelMonitors: true,

                    // Automatically tree-shake Sentry logger statements to reduce bundle size
                    disableLogger: true,

                    // Hides source maps from generated client bundles
                    hideSourceMaps: true,

                    // Transpiles SDK to be compatible with IE11 (increases bundle size)
                    transpileClientSDK: true,

                    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
                    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
                    // side errors will fail.
                    tunnelRoute: "/monitoring",

                    // For all available options, see:
                    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
                    // Upload a larger set of source maps for prettier stack traces (increases build time)
                    widenClientFileUpload: true
                }
            )
        : noWrapper

export default withBundleAnalyzer(withPWA(withSentry(nextConfig)))
