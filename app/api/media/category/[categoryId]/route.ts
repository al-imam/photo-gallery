import { onlyAdmin } from '@/server/next/middlewares/auth'
import { authRouter } from '@/server/next/router'
import service from '@/service'
import { NextResponse } from 'next/server'

export type PatchBody = { name: string }
export const PATCH = authRouter(onlyAdmin, async (_, ctx) => {
  console.log(ctx.params.categoryId)
  
  const category = await service.category.editCategory(
    ctx.params.categoryId!,
    ctx.body<PatchBody>().name
  )
    
  return NextResponse.json({ category })
})

export const DELETE = authRouter(onlyAdmin, async (_, ctx) => {
  await service.category.deleteCategory(ctx.params.categoryId!)
  return NextResponse.json(null)
})
