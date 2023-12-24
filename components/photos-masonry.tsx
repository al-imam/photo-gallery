import { MediaWithLoves } from '@/service/types'
import PhotoAlbum from 'react-photo-album'
import { PhotoCard } from './photo-card'

export function PhotosMasonry1({ items }: { items: MediaWithLoves[] }) {
  return (
    <PhotoAlbum
      layout="masonry"
      photos={items.map((item) => ({
        item,
        src: 'NONE',
        height: item.media_height,
        width: item.media_width,
      }))}
      columns={(containerWidth) => {
        if (containerWidth < 640) return 1
        if (containerWidth < 1024) return 2
        return 3
      }}
      renderPhoto={({ photo: { item }, wrapperStyle }) => (
        <div style={wrapperStyle}>
          <PhotoCard key={item.id} {...item} />
        </div>
      )}
    />
  )
}
