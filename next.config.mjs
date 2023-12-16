const source = '/api/yandex-disk'
const destination = `https://cdn.discordapp.com/attachments/${process.env.DISCORD_CHANNEL}`

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  pageExtensions: ['ts', 'tsx'],
  rewrites() {
    return [
      {
        source: source + '/:path*',
        destination: destination + '/:path*',
      },
    ]
  },
}

export default nextConfig
