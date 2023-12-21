import Discord, { TextChannel } from 'discord.js'
import {
  Attachment,
  generateMedia,
  generateAvatar,
  generateThumbnail,
} from './image'
import env from './env'
import ReqErr from './ReqError'

const client = new Discord.Client({ intents: [] })
client.login(env.DISCORD_TOKEN)

function getDiscordClient(): Promise<Discord.Client<true>> {
  return new Promise((resolve) => {
    if (client.isReady()) return resolve(client)
    client.once('ready', resolve)
  })
}

async function getDiscordChannel(channelId: string) {
  const client = await getDiscordClient()
  const channel =
    client.channels.cache.get(channelId) ??
    (await client.channels.fetch(channelId))

  if (!(channel instanceof TextChannel)) {
    throw new ReqErr('Channel not found.')
  }

  return channel
}

async function sendAttachments<T extends Attachment[]>(
  channelId: string,
  ...args: T
) {
  const channel = await getDiscordChannel(channelId)
  const data = await channel.send({ files: args })
  const normalized = data.attachments.map((attachment) => ({
    url: `${attachment.id}/${attachment.name}`,
    height: attachment.height!,
    width: attachment.width!,
    size: attachment.size,
  }))

  return {
    id: data.id,
    channel: data.channel.id,
    attachments: normalized as {
      [K in keyof T]: (typeof normalized)[number]
    },
  }
}

async function removeMessage(channelId: string, id: string) {
  const channel = await getDiscordChannel(channelId)
  const message = await channel.messages.fetch(id)
  return message.delete()
}

export default {
  async uploadMedia(buffer: Buffer) {
    const media = await generateMedia(buffer)
    const thumbnail = await generateThumbnail(buffer)
    const { attachments, ...data } = await sendAttachments(
      env.DISCORD_CHANNEL_MEDIA,
      media,
      thumbnail
    )

    return {
      ...data,
      media: attachments[0],
      thumbnail: attachments[1],
    }
  },

  async uploadAvatar(buffer: Buffer) {
    const { attachments, ...data } = await sendAttachments(
      env.DISCORD_CHANNEL_AVATAR,
      await generateAvatar(buffer, 64),
      await generateAvatar(buffer, 128),
      await generateAvatar(buffer, 256)
    )

    return {
      ...data,
      avatar_sm: attachments[0],
      avatar_md: attachments[1],
      avatar_lg: attachments[2],
    }
  },

  deleteMedia(id: string) {
    return removeMessage(env.DISCORD_CHANNEL_MEDIA, id)
  },

  deleteAvatar(id: string) {
    return removeMessage(env.DISCORD_CHANNEL_AVATAR, id)
  },
}
