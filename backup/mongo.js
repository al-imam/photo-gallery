const { URI } = require('./config')
const { MongoClient } = require('mongodb')
const client = new MongoClient(URI, {})

module.exports = () => {
  return new Promise((resolve, reject) => {
    client.connect().then(async () => {
      console.log('Connected successfully to MongoDB server')

      const database = client.db()
      const mediaCollection = database.collection('Media')

      try {
        resolve(await mediaCollection.find({}).toArray())
      } catch (error) {
        reject(error)
      } finally {
        client.close()
      }
    })
  })
}
