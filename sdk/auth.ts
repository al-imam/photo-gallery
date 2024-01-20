import { cookies } from 'next/headers'
import * as hash from '@/service/hash'
import ReqErr from '@/service/ReqError'
import service from '@/service'

export async function checkAuth() {
  const token = cookies().get('authorization')?.value
  if (!token) throw new ReqErr('Token is required')

  const user = await service.auth.checkAuth(token, 'cookie')
  const newToken = await hash.jwt.sign('auth', user.id)

  return {
    user,
    token: newToken,
  }
}
