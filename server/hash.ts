import * as bcrypt from 'bcryptjs'

const characters = '0123456789'
const charactersLength = characters.length

export async function generateOTP(length: number) {
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters[randomIndex]
  }

  return [result, await bcrypt.hash(result, 'secret')]
}

export async function encrypt(plain: string) {
  return bcrypt.hash(plain, 'secret')
}

export async function compare(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}
