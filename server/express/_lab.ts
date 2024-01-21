import db from '@/service/db'

;(async () => {
  const media = await db.media.findFirst({
    where: {},
    include: { updateRequest: true },
  })

  console.log(media)
})()
