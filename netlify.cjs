const { writeFileSync } = require('fs')

const source = '/media-storage-index'
const destination = `https://cdn.discordapp.com/attachments/${process.env.DISCORD_CHANNEL}`
writeFileSync(
  './netlify.toml',
  `[[redirects]]
from = "${source}/*"
to = "${destination}/:splat"
status = 200`
)
