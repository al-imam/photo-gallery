import r, { env } from 'rype'

export default env({
  GOOGLE_EMAIL: r.string(),
  GOOGLE_OAUTH_SECRET: r.string(),
  GOOGLE_PASSWORD: r.string(),
  DISCORD_CHANNEL_MEDIA: r.string(),
  DISCORD_CHANNEL_AVATAR: r.string(),
  DISCORD_TOKEN: r.string(),
  JWT_SECRET: r.string(),
  SERVICE_SECRET: r.string(),
  BCRYPT_SALT_ROUNDS: r.number(),
  BACKUP_TOKEN: r.string().optional(),

  NEXT_PUBLIC_URL: r.string(),
  NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID: r.string(),
})
