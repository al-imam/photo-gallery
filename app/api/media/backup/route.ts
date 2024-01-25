import { router } from '@/server/router'
import service from '@/service'
import ReqErr from '@/service/ReqError'
import env from '@/service/env'

export const GET = router(async (req) => {
  const backupEnv = env.BACKUP_TOKEN
  const backupToken = req.headers.get('backup-token')
  if (!backupToken) throw new ReqErr('Backup token is required')
  if (!backupEnv) throw new ReqErr('This server does not support backup')
  if (backupToken !== backupEnv) throw new ReqErr('Invalid backup token')

  const cursor = req.nextUrl.searchParams.get('cursor')
  const take = req.nextUrl.searchParams.get('take')

  const result = await service.media.getBackup(
    typeof cursor === 'string' ? cursor : undefined,
    take ? Number(take) : undefined
  )

  const string = result
    .map(({ id, url_media }) => `${id} ${url_media}`)
    .join('\n')

  return Response.json(string)
})
