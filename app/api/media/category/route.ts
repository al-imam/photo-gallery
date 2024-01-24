import { GetCategoryOptions } from '@/service/model/category'
import { NextResponse } from 'next/server'
import { authRouter, router } from '@/server/next/router'
import { onlyAdmin } from '@/server/next/middlewares/auth'
import service from '@/service'
import { MediaCategory } from '@prisma/client'

export type GetData = { categories: MediaCategory[] }
export type GetQuery = GetCategoryOptions
export const GET = router(async (_, ctx) => {
  return NextResponse.json<GetData>({
    categories: await service.category.getCategoryList(ctx.query<GetQuery>()),
  })
})

export type PostBody = { name: string }
export const POST = authRouter(onlyAdmin, async (_, ctx) => {
  return NextResponse.json({
    category: await service.category.createCategory(ctx.body<PostBody>().name),
  })
})
