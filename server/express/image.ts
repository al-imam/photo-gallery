import sharp from 'sharp'
// @ts-ignore
import * as magic from 'detect-file-type'

async function getExtension(imageBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    magic.default.fromBuffer(imageBuffer, (err: any, result: any) => {
      if (err) reject(err.message)
      else resolve(result.ext)
    })
  })
}

export async function generateThumbnail(imageBuffer: Buffer): Promise<Buffer> {
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

export default async function makeImage(attachment: Buffer, name: string) {
  return {
    attachment,
    name: `${name}.${await getExtension(attachment)}`,
  }
}
