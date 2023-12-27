exports.MAIN_FILE = 'ps-gallery.zip'
exports.TEMP_FILE = 'ps-gallery.temp.zip'
exports.ORIGIN = process.argv.at(2)
exports.TOKEN = process.argv.at(3)

if (!exports.ORIGIN || !exports.TOKEN) {
  console.error('Usage: node backup/mongo.js ORIGIN TOKEN')
  process.exit(1)
}

console.log({ ORIGIN: exports.ORIGIN, TOKEN: exports.TOKEN })
