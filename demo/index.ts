import { configDotenv } from 'dotenv'
import service from '@/service'
import db, { Media, User } from '@/service/db'
import { jwt } from '@/service/hash'
import { getRandomItems } from './utils'
import axios from 'axios'

console.clear()
configDotenv()

const IMAGE_PER_USER = 10
const USER_TO_CREATE = 10
const CATEGORY_TO_CREATE = 10
const REACTION_PER_USER = 50

;(async () => {
  for (let element in db) {
    const value: any = db[element as keyof typeof db]
    const isModel = Object.hasOwn(value, 'deleteMany')
    if (isModel) {
      await value.deleteMany({})
    }
  }

  console.log('Database cleared')
  const { data: images } = await axios.get<
    {
      storageRecordId: string
      media_size: number
      media_width: number
      media_height: number
      url_media: string
      url_thumbnail: string
    }[]
  >('http://localhost:8000/demo?limit=' + USER_TO_CREATE * IMAGE_PER_USER)
  console.log('Uploaded images Loaded')

  const userList: User[] = []
  const mediaList: Media[] = []
  let iImage = 0
  const categories = []

  for (let i = 0; i < CATEGORY_TO_CREATE; i++) {
    categories.push(
      await service.category.createCategory(`Test Category ${i + 1}`)
    )
  }

  for (let i = 0; i < USER_TO_CREATE; i++) {
    const user = await service.user.create(
      await jwt.sign('signup-email', `247sayad+${i + 1}@gmail.com`),
      { password: '123456' }
    )
    console.log('created:', user.email)
    userList.push(user)

    for (let i = 1; i <= IMAGE_PER_USER; i++) {
      const media = await service.media.createMedia(
        { ...user, role: 'VERIFIED' },
        {
          title: `Test Media ${iImage + 1}`,
          categoryId: getRandomItems(categories, 1)[0].id,
          ...images[iImage],
        }
      )

      console.log('Image created:', media.id)
      mediaList.push(media)
      iImage++
    }
  }

  const reactionsToCreate = []
  const reportsToCreate = []

  for (const user of userList) {
    const randomMedia = getRandomItems(mediaList, REACTION_PER_USER)
    for (const media of randomMedia) {
      reactionsToCreate.push({ mediaId: media.id, userId: user.id })
      reportsToCreate.push({
        userId: user.id,
        mediaId: media.id,
        type: 'OTHER' as const,
        message: 'This is a test report',
      })
    }
  }

  await db.mediaReport.createMany({ data: reportsToCreate })
  await db.mediaReaction.createMany({ data: reactionsToCreate })

  console.log('Done')
  process.exit()
})()
