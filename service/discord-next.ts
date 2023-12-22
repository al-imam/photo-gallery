import env from './env'

export default {
  async deleteMedia(id: string) {
    const apiUrl = `https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_MEDIA}/messages/${id}`

    return fetch(apiUrl, {
      method: 'DELETE',
      headers: { Authorization: `Bot ${env.DISCORD_TOKEN}` },
    })
  },

  async deleteAvatar(id: string) {
    const apiUrl = `https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_AVATAR}/messages/${id}`

    return fetch(apiUrl, {
      method: 'DELETE',
      headers: { Authorization: `Bot ${env.DISCORD_TOKEN}` },
    })
  },
}
