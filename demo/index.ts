console.clear()

import { configDotenv } from 'dotenv'
configDotenv()
import service from '@/service'
import db, { Media, User } from '@/service/db'
import { jwt } from '@/service/hash'
import { getImages, getRandomItems } from './utils'
import { uploadMedia } from '@/server/express/service'
;(async () => {
  await db.user.deleteMany({})
  const fullNameList = [
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

  const userList: User[] = []
  const mediaList: Media[] = []
  let userN = 0
  let imageN = 0

  for (let name of fullNameList) {
    const user = await service.user.create(
      await jwt.sign('signup-email', `247sayad+dev-${++userN}@gmail.com`),
      { name, password: '123' }
    )
    console.log('created:', user.email)
    userList.push(user)

    const images = await getImages(10)
    console.log('Images Loaded for user:', user.email)

    for (let element of images) {
      const media = await uploadMedia({ ...user, status: 'ADMIN' }, element, {
        newCategory: Math.random().toString(36).substring(7),
        title: `Test Media ${++imageN}`,
      })
      console.log('created:', media.id)
      mediaList.push(media)
    }
  }

  for (let user of userList) {
    const randomMedia = getRandomItems(mediaList, 50)
    for (let media of randomMedia) {
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
