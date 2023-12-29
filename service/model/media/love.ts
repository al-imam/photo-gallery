import db from '@/service/db'

export async function createLove(userId: string, mediaId: string) {
  return db.mediaReaction.create({
    data: {
      mediaId,
      userId,
    },
  })
}

export async function removeLove(userId: string, mediaId: string) {
  return db.mediaReaction.delete({
    where: { mediaId_userId: { mediaId, userId } },
  })
}
