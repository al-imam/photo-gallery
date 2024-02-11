import { MediaWithLoves } from '@/service/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar'
import { Badge } from '@/shadcn/ui/badge'
import { Button, buttonVariants } from '@/shadcn/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shadcn/ui/hover-card'
import { getMediaUrl } from '@/util'
import { Bookmark, Download, Heart } from 'lucide-react'
import Link from 'next/link'

export function PhotoCard({
  url_thumbnail,
  url_media,
  title,
  author,
  createdAt,
  description,
  id,
  tags,
}: MediaWithLoves) {
  return (
    <div className="stack-content group cursor-pointer rounded overflow-hidden shadow shadow-muted h-full">
      <Link href={`/photo/${id}`}>
        <img
          src={getMediaUrl(url_thumbnail)}
          alt={`${title}`}
          decoding="async"
          loading="lazy"
          className="w-full h-full image-loading"
        />
      </Link>
      <div className="flex opacity-0 mt-auto hover-unavailable:opacity-100 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-between p-4 pointer-events-none">
        <div className="flex gap-1 justify-end"></div>
        <div className="flex gap-1 justify-between font-sans">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href={`/author/${author.id}`}
                className="font-sm font-semibold text-foreground group-hover:pointer-events-auto"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={author.avatar_sm ?? undefined} />
                  <AvatarFallback>
                    {author.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 group-hover:pointer-events-auto">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-display">{author.name}</span>
                  <span className="text-muted-foreground">
                    {new Date(createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {(title || description) && (
                  <p className="flex flex-col">
                    <span>{title}</span>
                    <span className="text-muted-foreground">{description}</span>
                  </p>
                )}

                <div className="flex gap-1 flex-wrap">
                  {tags.slice(0, 5).map((tag, i) => (
                    <Badge key={tag + i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="flex flex-row-reverse gap-2">
            <a
              href={getMediaUrl(url_media)}
              download
              className={buttonVariants({
                size: 'icon',
                className: 'group-hover:pointer-events-auto',
              })}
            >
              <Download />
            </a>
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
