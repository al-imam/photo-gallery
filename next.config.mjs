/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  pageExtensions: ['ts', 'tsx'],
  rewrites() {
    return [
      {
        source: '/media-storage-index/:path*',
        destination: `https://cdn.discordapp.com/attachments/${process.env.DISCORD_CHANNEL}/:path*`,
      },
    ]
  },
}

export default nextConfig
