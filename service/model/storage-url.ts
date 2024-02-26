import db from '@/service/db'

function lteDate() {
  return new Date(Date.now() - 1000)
}

export async function getMediaUrls(take = 1000) {
  const mediaList = await db.media.findMany({
    take,
    orderBy: { createdAt: 'desc' },
    select: { storageRecordId: true },
    where: { storageUrlUpdatedAt: { lte: lteDate() } },
  })

  return mediaList.map((mediaList) => mediaList.storageRecordId)
}

export async function updateMediaUrls(
  body: {
    id: string
    media: string
    thumbnail: string
  }[]
) {
  return db.$transaction(
    body.map((chunk) =>
      db.media.update({
        where: { storageRecordId: chunk.id },
        data: {
          url_media: chunk.media,
          url_thumbnail: chunk.thumbnail,
          storageUrlUpdatedAt: new Date(),
        },
      })
    )
  )
}

export async function getAvatarUrls(take = 1000) {
  const avatarList = await db.user.findMany({
    take,
    select: { avatar_storageRecordId: true },
    orderBy: { avatar_storageUrlUpdatedAt: 'desc' },
    where: { avatar_storageUrlUpdatedAt: { lte: lteDate() } },
  })

  return avatarList.map((avatarList) => avatarList.avatar_storageRecordId)
}

export async function updateAvatarUrls(
  body: {
    id: string
    lg: string
    md: string
    sm: string
  }[]
) {
  return db.$transaction(
    body.map((chunk) =>
      db.user.update({
        where: { avatar_storageRecordId: chunk.id },
        data: {
          avatar_storageUrlUpdatedAt: new Date(),
          avatar_lg: chunk.lg,
          avatar_md: chunk.md,
          avatar_sm: chunk.sm,
        },
      })
    )
  )
}
