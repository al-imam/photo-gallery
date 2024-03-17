import { JWTPayload } from '../types'

export const jwtExpireConfig: Record<keyof JWTPayload, string> = {
  auth: '3d',
  cookie: '30d',
  'service-token-inner': '3m',
  'service-token-outer': '3m',
  'reset-password': '5m',
  'change-email': '15m',
  'public-email': '15m',
  'signup-email': '15m',
}
