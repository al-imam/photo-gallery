import { buttonVariants } from '$shadcn/ui/button'
import Link from 'next/link'
import Marquee from 'react-fast-marquee'
import { NavBar } from '/components/nav-bar'
import { PhotoCard } from '/components/photo-card'
import { SearchInput } from '/components/search-input'
import { random } from '/lib'

export default function Home() {
  return (
    <div className="content relative isolate min-h-[200vh] overflow-hidden bg-background">
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

      <div className="relative isolate overlay py-14 content-expand">
        <Marquee className="gap-2" pauseOnHover>
          <div className="flex gap-2 items-center">
            {Array(20)
              .fill(null)
              .map((_, i) => (
                <Link
                  href="#"
                  key={i}
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  Nature {i}
                </Link>
              ))}
          </div>
        </Marquee>
      </div>

      <main className="pb-6">
        <div className="md:columns-2 xl:columns-3 space-y-4">
          {Array(20)
            .fill(null)
            .map((_, i) => (
              <PhotoCard
                key={i}
                photoURL={`https://source.unsplash.com/random/${random(
                  50,
                  100
                )}x${random(50, 100)}`}
              />
            ))}
        </div>
      </main>
    </div>
  )
}
