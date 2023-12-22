console.clear()

import service from '@/service'
import db, { Media, User } from '@/service/db'
import { jwt } from '@/service/hash'
import { getImages, getRandomItems } from './utils'
import { uploadMedia } from '@/server/express/service'
;(async () => {
  await db.user.deleteMany({})
  const usernames = [
    'Aarif',
    // 'Aarman',
    // 'Abir',
    // 'Anik',
    // 'Farhan',
    // 'Fahim',
    // 'Imran',
    // 'Jamal',
    // 'Khaled',
    // 'Nabil',
    // 'Rafiq',
    // 'Rehan',
    // 'Riaz',
    // 'Shahid',
    // 'Taher',
  ]

  const userList: User[] = []
  const mediaList: Media[] = []

  for (let name of usernames) {
    const user = await service.user.create(
      await jwt.sign('signup-email', `me+${name.toLowerCase()}@sayad.dev`),
      {
        name,
        password: '123',
      }
    )
    console.log('created:', user.email)
    userList.push(user)

    const images = await getImages(10)
    for (let element of images) {
      const media = await uploadMedia({ ...user, status: 'ADMIN' }, element, {})
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
})()
