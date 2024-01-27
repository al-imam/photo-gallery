import { onlyAdmin } from '@/server/middlewares/auth'
import { authRouter } from '@/server/router'
import service from '@/service'
import { NextResponse } from 'next/server'

export type PatchBody = { name: string }
export type PatchData = { category: Awaited<ReturnType<typeof service.category.editCategory>> }
export const PATCH = authRouter(onlyAdmin, async (_, ctx) => {
  const category = await service.category.editCategory(
    ctx.params.categoryId!,
    ctx.body<PatchBody>().name
  )

  return NextResponse.json<PatchData>({ category })
})

export const DELETE = authRouter(onlyAdmin, async (_, ctx) => {
  await service.category.deleteCategory(ctx.params.categoryId!)
  return NextResponse.json(null)
})
