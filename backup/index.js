#!/usr/bin/env node

console.clear()
const fs = require('fs')
const zip = require('./zip')
const mongo = require('./mongo')
const { MAIN_FILE, TEMP_FILE } = require('./config')

;(async () => {
  const mediaDocuments = await mongo()
  const currentZip = zip.read(MAIN_FILE)
  const newZip = zip.write(TEMP_FILE, () => {
    fs.renameSync(TEMP_FILE, MAIN_FILE)
    console.log('Done!')
  })

  for (let { id, url } of mediaDocuments) {
    const existingFile = currentZip[id]
    if (existingFile) {
      console.log('Found:', existingFile.entryName)
      newZip.append(existingFile.getData(), { name: existingFile.entryName })
      continue
    }

    const response = await fetch(url)
    console.log('Fetched:', url)

    const ext = url.split('.').at(-1)
    const buffer = Buffer.from(await response.arrayBuffer())
    newZip.append(buffer, { name: `${id}.${ext}` })
  }

  newZip.finalize()
})()
