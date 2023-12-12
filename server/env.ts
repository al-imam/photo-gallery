import r, { env } from 'rype'

export default env({
  DATABASE_URL: r.string(),
  DISCORD_CHANNEL: r.string(),
  DISCORD_TOKEN: r.string(),
  JWT_SECRET: r.string(),
})
