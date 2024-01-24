import axios from 'axios'
import { generateToken } from './token'
;(async () => {
  try {
    const res = await axios.post(
      'http://localhost:3000/api/service',
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
