import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar'
import { Button } from '@/shadcn/ui/button'
import { Bookmark, Download, Heart } from 'lucide-react'
import Link from 'next/link'

interface PhotoCardProps {
  photoURL?: string
}

export function PhotoCard({ photoURL }: PhotoCardProps) {
  return (
    <div className="stack-content group cursor-pointer rounded overflow-hidden shadow shadow-muted">
      <Link href="#">
        <img
          src={photoURL ?? 'https://source.unsplash.com/random'}
          alt="random"
          loading="lazy"
          className="min-w-full"
        />
      </Link>
      <div className="flex opacity-0 mt-auto group-hover:opacity-100 transition-opacity duration-300 flex-col justify-between p-4 pointer-events-none">
        <div className="flex gap-1 justify-end"></div>
        <div className="flex gap-1 justify-between">
          <Link
            href="#"
            className="font-sm font-semibold text-foreground group-hover:pointer-events-auto"
          >
            <Avatar className="h-10 w-10 rounded-sm">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-row-reverse gap-2">
            <Button size="icon" className="group-hover:pointer-events-auto">
              <Download />
            </Button>
            <Button size="icon" className="group-hover:pointer-events-auto">
              <Bookmark />
            </Button>
            <Button size="icon" className="group-hover:pointer-events-auto">
              <Heart />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
