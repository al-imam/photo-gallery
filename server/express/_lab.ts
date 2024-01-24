import axios from 'axios'
import { generateToken } from './token'
import env from '@/service/env'
;(async () => {
  try {
    const res = await axios.post(
      env.NEXT_PUBLIC_URL + '/api/service',
      {},
      {
        headers: {
          'service-token': await generateToken(),
        },
      }
    )
    console.log(res.data)
  } catch (err: any) {
    console.log(err.response.data)
  }
})()
