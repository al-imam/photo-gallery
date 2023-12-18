import { decodeJwt } from 'jose'

export function decode(jwt: string) {
  try {
    return decodeJwt(jwt)
  } catch {
    return {}
  }
}
