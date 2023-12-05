/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  pageExtensions: ["ts", "tsx"],
};

export default nextConfig;
