import axios, { AxiosError } from 'axios'
import env from './env'

export type GoogleData = { email: string; name: string; avatar: string }

export default async function (
  authCode: string
): Promise<[GoogleData, null] | [null, string]> {
  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code: authCode,
        client_secret: env.GOOGLE_OAUTH_SECRET,
        client_id: env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        redirect_uri: `${env.NEXT_PUBLIC_URL}/api/auth/google`,
        grant_type: 'authorization_code',
      }
    )

    const { data } = await axios.get(
      'https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names,photos',
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      }
    )

    const email: string = data.emailAddresses[0].value
    const name: string = data.names[0].displayName
    const avatar: string = data.photos[0].url
    return [{ email, name, avatar }, null]
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return [null, String(error.response?.data?.error_description)]
    }

    return [null, String(error.message)]
  }
}
