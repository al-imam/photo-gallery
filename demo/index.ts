import { configDotenv } from 'dotenv'
import service from '@/service'
import db, { Media, User } from '@/service/db'
import { jwt } from '@/service/hash'
import { fetchMessages, getRandomItems, uploadMessage } from './utils'

console.clear()
configDotenv()

const IMAGE_PER_USER = 10
const REACTION_PER_USER = 50
const NAME_LIST = [
  'Nazmus Sayad',
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
  console.log('Users deleted')
  const images = await fetchMessages(NAME_LIST.length * IMAGE_PER_USER)
  console.log('Uploaded images Loaded')

  const userList: User[] = []
  const mediaList: Media[] = []
  let iUser = 0
  let iImage = 0

  for (const name of NAME_LIST) {
    const user = await service.user.create(
      await jwt.sign('signup-email', `247sayad+${iUser + 1}@gmail.com`),
      { name, password: '123456' }
    )
    console.log('created:', user.email)
    userList.push(user)
    iUser++

    for (let i = 1; i <= IMAGE_PER_USER; i++) {
      const media = await service.media.createMedia(
        { ...user, role: 'ADMIN' },
        {
          title: `Test Media ${iImage + 1}`,
          newCategory: Math.random().toString(36).substring(7),
        },
        async () => images[iImage] ?? uploadMessage(),
        async (result) => console.log('Deleting:', result.id)
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
