const baseSource = '/api/yandex-disk'
const baseDestination = `https://cdn.discordapp.com/attachments`

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  pageExtensions: ['ts', 'tsx'],
  rewrites() {
    return [
      {
        source: `${baseSource}/media/:path*`,
        destination: `${baseDestination}/${process.env.DISCORD_CHANNEL_MEDIA}/:path*`,
      },
      {
        source: `${baseSource}/avatar/:path*`,
        destination: `${baseDestination}/${process.env.DISCORD_CHANNEL_AVATAR}/:path*`,
      },
    ]
  },
}

export default nextConfig
