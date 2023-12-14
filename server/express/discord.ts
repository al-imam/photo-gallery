import Discord, { TextChannel } from 'discord.js'
import env from '../../service/env'
import makeImage, { generateThumbnail } from './image'
export default { upload, remove }

const client = new Discord.Client({ intents: [] })
client.login(env.DISCORD_TOKEN)

function getDiscordClient(): Promise<Discord.Client<true>> {
  return new Promise((resolve) => {
    if (client.isReady()) return resolve(client)
    client.once('ready', resolve)
  })
}

async function getDiscordChannel() {
  const client = await getDiscordClient()
  const channel =
    client.channels.cache.get(env.DISCORD_CHANNEL) ??
    (await client.channels.fetch(env.DISCORD_CHANNEL))

  if (!(channel instanceof TextChannel)) {
    throw new Error('Channel not found.')
  }

  return channel
}

async function sendFiles(...args: { name: string; attachment: Buffer }[]) {
  const channel = await getDiscordChannel()
  return channel.send({ files: args })
}

async function upload(buffer: Buffer) {
  const mediaFile = await makeImage(buffer, 'media')
  const thumbnailBuffer = await generateThumbnail(buffer)
  const thumbnailFile = await makeImage(thumbnailBuffer, 'thumbnail')

  const data = await sendFiles(mediaFile, thumbnailFile)
  const [media, thumbnail] = data.attachments.map((attachment) => ({
    size: attachment.size,
    width: attachment.width!,
    height: attachment.height!,
    url: `${attachment.id}/${attachment.name}`,
  }))

  return {
    media,
    thumbnail,
    id: data.id,
  }
}

async function remove(id: string) {
  const channel = await getDiscordChannel()
  const message = await channel.messages.fetch(id)
  return message.delete()
}
