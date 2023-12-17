import axios from 'axios'

export const request = axios.create({
  baseURL: '/api',
})

export const GET = request.get
export const POST = request.post
export const PUT = request.put
export const PATCH = request.patch
export const DELETE = request.delete
