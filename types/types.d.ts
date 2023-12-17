import { User as FullUser } from '/service/db'
import { USER_SAFE_FIELDS } from "/service/config";

export type SafeUser = Pick<FullUser, (typeof USER_SAFE_FIELDS)[number]>
