/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            topLevelAwait: true,
            layers: true,
        };
        return config;
    },
    pageExtensions: ["js", "jsx", "ts", "tsx"],
};

module.exports = nextConfig;