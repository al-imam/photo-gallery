import { InfiniteScroll } from '@/components/infinite-scroll'
import { Button } from '@/shadcn/ui/button'
import { BriefcaseIcon, GraduationCapIcon, MapPinIcon } from 'lucide-react'
import Image from 'next/image'

export default function UserProfile() {
  return (
    <main className="content">
      <section className="relative h-96 overflow-hidden rounded-b-md">
        <Image
          src="https://source.unsplash.com/random/1280x384"
          alt="random"
          layout="fill"
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
            <div className="w-36 h-36 overflow-hidden rounded-full -translate-y-1/2 shadow-md order-2">
              <Image
                src="https://source.unsplash.com/random/144x144?character"
                alt="random"
                width={144}
                height={144}
                className="w-full h-full object-cover select-none dragging-none"
              />
            </div>
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
            <h3 className="text-4xl font-semibold font-display">Al Imam</h3>
            <div className="text-sm flex items-center gap-2 font-bold uppercase">
              <MapPinIcon className="w-4 h-4" />
              Noakhali, Bangladesh
            </div>
            <div className="text-sm flex items-center gap-2 font-bold uppercase">
              <BriefcaseIcon className="w-4 h-4" />
              Software Engineer - Creative It Officer
            </div>
            <div className="text-sm flex items-center gap-2 font-bold uppercase">
              <GraduationCapIcon className="w-4 h-4" />
              University of Computer Science
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 3 }).map((_1, i) => (
                <Button key={i} variant="link">
                  Link
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-10 py-10 border-t border-border text-center">
            <div className="flex flex-wrap justify-center">
              <p className="leading-relaxed [text-wrap:balance] w-full px-4 max-w-[60ch]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reiciendis eaque ipsam debitis quasi. Minima ipsum magnam
                provident dolore voluptates perferendis autem nisi explicabo
                error? Est similique incidunt exercitationem facilis voluptatum!
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="-mt-10">
        <InfiniteScroll />
      </section>
    </main>
  )
}
