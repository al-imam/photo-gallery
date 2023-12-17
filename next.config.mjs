function generateRewrite(src, dest) {
  return {
    source: `/api/yandex-disk/${src}/:id/:name`,
    destination: `https://cdn.discordapp.com/attachments/${dest}/:id/:name`,
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  pageExtensions: ['ts', 'tsx'],
  rewrites() {
    return [
      generateRewrite('media', process.env.DISCORD_CHANNEL_MEDIA),
      generateRewrite('avatar', process.env.DISCORD_CHANNEL_AVATAR),
    ]
  },
}

export default nextConfig
