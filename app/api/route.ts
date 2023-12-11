const url = 'https://sample-videos.com/img/Sample-jpg-image-20mb.jpg'

export async function GET() {
  // return fetch(url)

  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const headers = {
    'content-type': response.headers.get('content-type')!,
  }

  return new Response(buffer, { headers })
}
