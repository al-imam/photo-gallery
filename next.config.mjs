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

  async headers() {
    return [
      // {
      //   // https://vercel.com/guides/how-to-enable-cors
      //   source: '/api/:path*',
      //   headers: [
      //     { key: 'Access-Control-Allow-Credentials', value: 'true' },
      //     { key: 'Access-Control-Allow-Origin', value: '*' },
      //     {
      //       key: 'Access-Control-Allow-Methods',
      //       value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      //     },
      //     {
      //       key: 'Access-Control-Allow-Headers',
      //       value:
      //         'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      //     },
      //   ],
      // },
    ]
  },
}

export default nextConfig
