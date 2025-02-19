
const isProd = process.env.NODE_PATH === 'production'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
const nextConfig = {
    basePath,
    compress: isProd,
    experimental: {
        optimizePackageImports: [
            'emoji-mart',
            '@emoji-mart/react',
            '@emoji-mart/data',
            '@icons-pack/react-simple-icons',
            '@lobehub/ui',
            'gpt-tokenizer',
            'chroma-js',
        ],
        webVitalsAttribution: ['CLS', 'LCP'],
    },
}

export default nextConfig;

