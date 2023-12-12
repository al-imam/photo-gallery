exports.MAIN_FILE = 'ps-gallery.zip'
exports.TEMP_FILE = 'ps-gallery.temp.zip'
exports.URI = process.argv.at(2)
exports.CHANNEL = process.argv.at(3)
console.log({ URI: exports.URI, CHANNEL: exports.CHANNEL })
