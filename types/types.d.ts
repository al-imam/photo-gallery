import config from '@/service/config'
import { User as FullUser } from '@/service/db'

export type SafeUser = Pick<FullUser, (typeof config.user.safeFields)[number]>
