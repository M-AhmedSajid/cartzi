/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
        'localhost:3000',
        'DESKTOP-KFI2LPC.local:3000', // Replace 'my-laptop' with your actual computer name
        '*.local',             // Allows any device on your local network
    ],
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
