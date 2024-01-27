import { GetData } from '@/app/api/media/category/route'
import { GET } from '@/lib'
import { useQuery } from '@tanstack/react-query'

export function useCategory() {
  return useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const res = await GET<GetData>('media/category')
      return res.data
    },
    initialData: { categories: [] },
  })
}
