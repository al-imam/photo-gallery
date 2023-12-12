const fs = require('fs')
const AdmZip = require('adm-zip')
const archiver = require('archiver')

exports.read = (path) => {
  if (!fs.existsSync(path)) return {}

  const zip = new AdmZip(path)
  return Object.fromEntries(
    zip.getEntries().map(({ entryName, getData }) => {
      const [name, ext] = entryName.split('.')
      return [name, { id: name, ext, entryName, getData }]
    })
  )
}

exports.write = (path, close) => {
  const output = fs.createWriteStream(path)
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })

  output.on('close', close)

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
    } else {
      throw err
    }
  })

  archive.on('error', function (err) {
    throw err
  })

  archive.pipe(output)
  return archive
}
