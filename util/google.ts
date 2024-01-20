export default function googleAuth(state?: string) {
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
  const redirect_uri = process.env.NEXT_PUBLIC_URL + '/api/auth/google'
  const client_id =
    '951547594196-38fkhgva68oaq568evgt0icq10o1nhkh.apps.googleusercontent.com'

  const form = document.createElement('form')
  form.setAttribute('action', oauth2Endpoint)
  form.setAttribute('method', 'GET')

  const params = {
    client_id,
    redirect_uri,
    response_type: 'code',
    scope:
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    state: JSON.stringify({
      redirect_uri,
      client_id,
      state,
    }),
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
