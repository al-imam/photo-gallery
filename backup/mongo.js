const { ORIGIN, TOKEN } = require('./config.js')
const maxListLength = 25000

async function getMediaList(cursor = '') {
  const res = await fetch(
    `${ORIGIN}/api/media/backup?cursor=${cursor}&take=${maxListLength}`,
    { headers: { 'backup-token': TOKEN } }
  ).catch(console.error)

  const data = await res.json()
  return data.split('\n').map((line) => {
    const [id, url] = line.split(' ')
    return { id, url: `${ORIGIN}/api/yandex-disk/media/${url}` }
  })
}

module.exports = async () => {
  const list = []

  while (true) {
    const data = await getMediaList(list.at(-1)?.id)
    list.push(...data)
    if (data.length < maxListLength) break
  }

  console.log('Total:', list.length)
  return list
}
