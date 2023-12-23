import { joinUrl } from '@/util'
import axios from 'axios'

const api = axios.create({
  baseURL: joinUrl(
    process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000',
    'api'
  ),
  headers: {
    'Content-Type': 'application/json',
  },
})

export const GET = api.get
export const POST = api.post
export const PUT = api.put
export const PATCH = api.patch
export const DELETE = api.delete
