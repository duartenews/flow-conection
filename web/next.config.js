/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure Turbopack uses the correct project root
    turbopack: {
        root: __dirname,
    },
};

module.exports = nextConfig;
