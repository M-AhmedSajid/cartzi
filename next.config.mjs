/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['192.168.0.103'],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
        ],
    },
};

export default nextConfig;
