import {
  getCategoryList,
  GetCategoryOptions,
  findOrCreateCategory,
} from '@/service/model/category'
import { NextResponse } from 'next/server'
import { authRouter, router } from '@/server/next/router'
import { onlyAdmin } from '@/server/next/middlewares/auth'

export type GetQuery = GetCategoryOptions
export const GET = router(async (_, ctx) => {
  return NextResponse.json({
    categories: await getCategoryList(ctx.query<GetQuery>()),
  })
})

export type PostBody = { name: string }
export const POST = authRouter(onlyAdmin, async (_, ctx) => {
  return NextResponse.json({
    category: await findOrCreateCategory(ctx.body<PostBody>().name),
  })
})
