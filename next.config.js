const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH
/** @type {import('next').NextConfig} */
const nextConfig = {
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
            }
        ]
    },
};

module.exports = nextConfig;