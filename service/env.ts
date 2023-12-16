import r, { env } from 'rype'

export default env({
  GOOGLE_EMAIL: r.string(),
  GOOGLE_PASSWORD: r.string(),
  DISCORD_CHANNEL: r.string(),
  DISCORD_TOKEN: r.string(),
  JWT_SECRET: r.string(),
  BCRYPT_SALT_ROUNDS: r.number(),
})
