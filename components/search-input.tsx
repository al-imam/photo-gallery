'use client'

import { cn } from '@/shadcn/utils'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface SearchInputProps {
  className?: string
}

export function SearchInput({ className }: SearchInputProps) {
  const searchParams = useSearchParams()
  const [focus, setFocus] = useState(false)
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const pathname = usePathname()
  const { replace } = useRouter()

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch(search)
      }}
      className={cn(
        'flex gap-1 rounded-md border border-input bg-background text-base font-sans transition-all',
        { 'ring-4 ring-blue-500/80 border-transparent': focus },
        className
      )}
    >
      <input
        type="text"
        placeholder="Search ..."
        className="h-10 w-full border-none bg-transparent px-4 py-3  ring-offset-background placeholder:text-muted-foreground focus:border-none focus:outline-none"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <button className="focus-visible:outline-none focus-visible:text-foreground text-muted-foreground hover:text-foreground pr-2 transition-all ">
        <Search />
      </button>
    </form>
  )
}
