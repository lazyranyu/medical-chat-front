const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH
/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: isProd ? `${basePath}/` : '', // 去掉 /_next/static 层级
    basePath: isProd ? basePath : '', // 基础路径
    trailingSlash: true, // 确保路径结尾斜杠一致性

    compress: isProd,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*' // 修改为包含/api前缀
      },
        {
            source: '/images/:path*',
            destination: 'http://127.0.0.1:9005/image/:path*'
        }
    ]
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
            },
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    }
                ]
            }
        ]
    },
};

module.exports = nextConfig;