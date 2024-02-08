import { GetBody } from '@/app/api/user/[userId]/route'
import { InfiniteScroll } from '@/components/infinite-scroll'
import { GET } from '@/lib'
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar'
import { Button, buttonVariants } from '@/shadcn/ui/button'
import { getAvatarUrl, joinUrl } from '@/util'
import { MapPinIcon } from 'lucide-react'
import Link from 'next/link'

export default async function UserProfile({
  params: { authorId },
}: {
  params: { authorId: string }
}) {
  const { data: author } = await GET<GetBody>(joinUrl('user', authorId))

  return (
    <main className="content">
      <section className="relative h-96 overflow-hidden rounded-b-md">
        <img
          src="https://source.unsplash.com/random"
          alt="random"
          className="w-full h-full object-cover select-none dragging-none"
        />

        <span className="inset-0 absolute opacity-50 bg-black/10" />

        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style={{ transform: 'translateZ(0px)' }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x={0}
            y={0}
          >
            <polygon
              className="text-muted-foreground fill-current"
              points="2560 0 2560 100 0 100"
            />
          </svg>
        </div>
      </section>
      <section className="px-2">
        <div className="min-h-96 bg-background rounded-xl -translate-y-36 shadow-md shadow-foreground/5 text-foreground">
          <div className="flex justify-between">
            <div className="self-center order-3 flex-1 text-center p-2">
              <Button variant={'secondary'} className="w-max">
                Follow
              </Button>
            </div>

            <Avatar className="w-36 h-36 -translate-y-1/2 order-2 bg-foreground">
              <AvatarImage
                src={getAvatarUrl(author.user.avatar_md!)}
                className="w-full h-full object-cover select-none dragging-none"
                alt={author.user.name}
              />
              <AvatarFallback className="bg-foreground text-background">
                {author.user.name}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col  sm:flex-row gap-y-2 p-2 gap-x-6 self-center justify-center order-1 flex-1 ">
              <div className="text-center">
                <p className="text-xl font-bold uppercase tracking-wide">10</p>
                <span className="text-sm">Photos</span>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold uppercase tracking-wide">89</p>
                <span className="text-sm">Likes</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-4xl font-semibold font-display">
              {author.user.name}
            </h3>

            {author.profile.location && (
              <div className="text-sm flex items-center gap-2 font-bold uppercase">
                <MapPinIcon className="w-4 h-4" />
                {author.profile.location}
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {author.profile.links.map((link) => (
                <Link
                  href={link.url}
                  key={link.id}
                  className={buttonVariants({ variant: 'link' })}
                >
                  {link.type}
                </Link>
              ))}
            </div>
          </div>
          {author.profile.bio && (
            <div className="mt-10 py-10 border-t border-border text-center">
              <div className="flex flex-wrap justify-center">
                <p className="leading-relaxed [text-wrap:balance] w-full px-4 max-w-[60ch]">
                  {author.profile.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="-mt-10">
        <InfiniteScroll userId={author.user.id} />
      </section>
    </main>
  )
}
