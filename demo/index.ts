import { configDotenv } from 'dotenv'
import service from '@/service'
import db, { Media, User } from '@/service/db'
import { jwt } from '@/service/hash'
import { createMediaFactory } from '@/service/model/media'
import { fetchMessages, getRandomItems } from './utils'

console.clear()
configDotenv()

const IMAGE_PER_USER = 10
const REACTION_PER_USER = 50
const NAME_LIST = [
  'Mohammad Rahman',
  'Fatima Khanam',
  'Abul Hasan Chowdhury',
  'Shabnam Akhtar Chowdhury',
  'Aminul Islam Miah',
  'Taslima Begum',
  'Rafiqul Haque Siddique',
  'Farida Yasmin Khan',
  'Nurul Islam Mia',
  'Rukhsar Ahmed Chowdhury',
  'Sadia Rahman',
  'Shahidul Islam',
  'Nasrin Akhtar',
  'Mizanur Rahman',
  'Sultana Ahmed',
  'Kamrul Hasan',
  'Ayesha Begum',
  'Zahidul Haque',
  'Maliha Khan',
]

;(async () => {
  await db.user.deleteMany({})
  const images = await fetchMessages(NAME_LIST.length * IMAGE_PER_USER)
  console.log('Images Loaded')

  const userList: User[] = []
  const mediaList: Media[] = []
  let iUser = 0
  let iImage = 0

  for (const name of NAME_LIST) {
    const user = await service.user.create(
      await jwt.sign('signup-email', `247sayad+${iUser + 1}@gmail.com`),
      { name, password: '123' }
    )
    console.log('created:', user.email)
    userList.push(user)
    iUser++

    for (let i = 1; i <= IMAGE_PER_USER; i++) {
      const discordResult = images[iImage]

      const createMedia = createMediaFactory({
        newCategory: Math.random().toString(36).substring(7),
        title: `Test Media ${iImage + 1}`,
      })

      const media = await createMedia(
        { ...user, status: 'ADMIN' },
        discordResult
      )

      console.log('Image created:', media.id)
      mediaList.push(media)
      iImage++
    }
  }

  for (const user of userList) {
    const randomMedia = getRandomItems(mediaList, REACTION_PER_USER)
    for (const media of randomMedia) {
      await service.media.createLove(user.id, media.id)
      await service.media.createReport(user.id, media.id, {
        type: 'OTHER',
        message: 'This is a test report',
      })
    }
  }

  console.log('Done')
  process.exit()
})()
