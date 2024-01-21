import { joinUrl } from '@/util'
import axios from 'axios'

console.log(process.env)

const api = axios.create({
  baseURL: joinUrl(
    // process.env.NEXT_PUBLIC_URL,
    process.env.VERCEL_URL,
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
