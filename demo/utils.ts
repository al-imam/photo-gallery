import discord, { getDiscordChannel } from '@/service/discord'
import env from '@/service/env'
import { DiscordMediaUploadResult } from '@/service/types'
import { extractAttachment } from '@/service/utils'

export function getRandomItems<T extends any[], N extends number>(
  array: T,
  n: N
): T & { length: N } {
  const copyArray = array.slice()

  for (let i = copyArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copyArray[i]
    copyArray[i] = copyArray[j]
    copyArray[j] = temp
  }

  return copyArray.slice(0, n) as any
}

export async function fetchMessages(remaining: number) {
  const messages: DiscordMediaUploadResult[] = []
  const channel = await getDiscordChannel(env.DISCORD_CHANNEL_MEDIA)

  while (remaining) {
    const rawMessages = await channel.messages.fetch({
      limit: remaining < 100 ? remaining : 100,
    })

    if (!rawMessages.size) break
    rawMessages.forEach((message) => {
      const [media, thumbnail] = message.attachments.map(extractAttachment)

      remaining--
      messages.push({
        id: message.id,
        channel: message.channel.id,
        media,
        thumbnail,
      })
    })
  }

  return messages
}

export async function uploadMessage() {
  const response = await fetch('https://source.unsplash.com/random/?palestine')
  const buffer = await response.arrayBuffer()
  return discord.uploadMedia(Buffer.from(buffer))
}
