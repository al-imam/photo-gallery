import { writeFileSync } from 'fs'

const source = '/media-storage-index'
const destination = `https://cdn.discordapp.com/attachments/${process.env.DISCORD_CHANNEL}`
writeFileSync(
  './.next/netlify.toml',
  `[[redirects]]
from = "${source}/*"
to = "${destination}/:splat"
status = 200`
)

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
