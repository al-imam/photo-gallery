import { GetData } from '@/app/api/media/route'
import { CategoryMarquee } from '@/components/category-marquee'
import { InfiniteScroll } from '@/components/infinite-scroll'
import { NavBar } from '@/components/nav'
import { SearchInput } from '@/components/search-input'
import { GET } from '@/lib'

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data: res } = await GET<GetData>('media', {
    params: { limit: 50, search: searchParams.q },
  })

  return (
    <div className="content relative isolate min-h-screen overflow-hidden bg-background">
      <NavBar takeHeight={false} />

      <div className="stack-content content-expand">
        <img
          src="https://images.unsplash.com/photo-1563804951831-49844db19644?q=80&w=1995&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="random"
          className="min-w-full h-[50vh] object-cover"
        />

        <div className="content place-content-center">
          <div className="max-w-xl mx-auto flex flex-col gap-4">
            <h1 className="font-display text-2xl sm:text-4xl">
              The best free stock photos, royalty free images & videos shared by
              creators.
            </h1>
            <div className="w-full">
              <SearchInput />
            </div>
          </div>
        </div>
      </div>

      <CategoryMarquee />

      <main className="pb-6">
        <InfiniteScroll
          initialItems={res.mediaList}
          cursor={res.mediaList.at(-1)?.id}
        />
      </main>
    </div>
  )
}
