#!/usr/bin/env node

console.clear()
const fs = require('fs')
const zip = require('./zip')
const mongo = require('./mongo')
const { MAIN_FILE, TEMP_FILE, CHANNEL } = require('./config')

;(async () => {
  const mediaDocuments = await mongo()
  const currentZip = zip.read(MAIN_FILE)
  const newZip = zip.write(TEMP_FILE, () => {
    fs.renameSync(TEMP_FILE, MAIN_FILE)
    console.log('Done!')
  })

  for (let document of mediaDocuments) {
    const ID = document._id.toString()
    const existingFile = currentZip[ID]
    if (existingFile) {
      console.log('Found:', existingFile.entryName)
      newZip.append(existingFile.getData(), { name: existingFile.entryName })
      continue
    }

    const url = `https://cdn.discordapp.com/attachments/${CHANNEL}/${document.url_media}`
    const response = await fetch(url)
    console.log('Fetched:', url)

    const ext = document.url_media.split('.').at(-1)
    const buffer = Buffer.from(await response.arrayBuffer())
    newZip.append(buffer, { name: `${ID}.${ext}` })
  }

  newZip.finalize()
})()
