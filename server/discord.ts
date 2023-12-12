import axios from 'axios'
import FormData from 'form-data'
import sharp from 'sharp'
// @ts-ignore
import * as magic from 'detect-file-type'
import env from './env'

type Attachment = {
  id: string
  filename: string
  size: number
  url: string
  proxy_url: string
  content_type: string
  content_scan_version: number
}

type Data = {
  id: string
  channel_id: string
  attachments: Attachment[]
}

async function getExtension(imageBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    magic.default.fromBuffer(imageBuffer, (err: any, result: any) => {
      if (err) reject(err.message)
      else resolve(result.ext)
    })
  })
}

async function generateThumbnail(imageBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    sharp(imageBuffer)
      .resize({
        withoutEnlargement: true,
        fit: 'inside',
        width: 768,
        height: 768,
      })
      .webp({ quality: 75 })
      .toBuffer((err, buffer) => {
        if (err) reject(err.message)
        else resolve(buffer)
      })
  })
}

async function generateFormData(image: Buffer): Promise<FormData> {
  const formData = new FormData()
  const thumbnail = await generateThumbnail(image)

  formData.append('media-image', image, {
    filename: 'file.' + (await getExtension(image)),
  })

  formData.append('media-thumbnail', thumbnail, {
    filename: 'file.thumbnail.' + (await getExtension(thumbnail)),
  })

  return formData
}

async function uploadFormData(formData: FormData): Promise<Data> {
  try {
    const response = await axios.post<Data>(
      `https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL}/messages`,
      formData,
      { headers: { Authorization: `Bot ${env.DISCORD_TOKEN}` } }
    )

    return response.data
  } catch (error: any) {
    if (typeof error === 'string') throw new Error(error)

    const statusCode = error.response?.statusCode
    if (!statusCode || statusCode < 400 || statusCode >= 500) {
      console.log(error.response?.data)
      throw new Error("Something's wrong with the request!")
    }

    throw new Error(error?.response?.data?.message ?? error.message)
  }
}

async function upload(image: Buffer) {
  const formData = await generateFormData(image)
  const data = await uploadFormData(formData)
  const [media, thumbnail] = data.attachments.map((attachment) => ({
    size: attachment.size,
    contentType: attachment.content_type,
    url: `${attachment.id}/${attachment.filename}`,
  }))

  return {
    media,
    thumbnail,
    id: data.id,
    channel_id: data.channel_id,
  }
}

async function remove() {}

export default { upload, remove }
