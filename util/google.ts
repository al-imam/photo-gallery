export default function googleAuth(state?: string) {
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'

  const form = document.createElement('form')
  form.setAttribute('action', oauth2Endpoint)
  form.setAttribute('method', 'GET')

  const params = {
    state: state,
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT,
    scope:
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  }

  for (let p in params) {
    const input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', p)
    input.setAttribute('value', params[p as keyof typeof params]!)
    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
}
