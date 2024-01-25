import { GET } from '@/lib'
import { buttonVariants } from '@/shadcn/ui/button'
import { joinUrl } from '@/util'
import Link from 'next/link'
import Marquee from 'react-fast-marquee'

export async function CategoryMarquee() {
  const {
    data: { categories },
  } = await GET('media/category')

  return (
    <div className="relative isolate overlay py-14 content-expand">
      <Marquee className="gap-2" pauseOnHover>
        <div className="flex gap-2 items-center">
          {categories.map((category: any) => (
            <Link
              href={joinUrl('/category', category.id)}
              key={category.id}
              className={buttonVariants({ variant: 'secondary' })}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </Marquee>
    </div>
  )
}
