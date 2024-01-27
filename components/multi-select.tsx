'use client'

import { X } from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/shadcn/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/shadcn/ui/command'
import { Command as CommandPrimitive } from 'cmdk'
import { toast } from 'sonner'

export type Item = Record<'value' | 'label', string>

interface SelectProps {
  creatable?: boolean
  placeholder?: string
  items: Item[]
  selected: Item[]
  setSelected: React.Dispatch<React.SetStateAction<Item[]>>
  limit?: number
  limitWaring?: string
  duplicateWarning?: string
}

export function MultiSelect({
  selected,
  setSelected,
  creatable = true,
  placeholder,
  items,
  limit = Infinity,
  limitWaring = "You've reached the limit!",
  duplicateWarning = "You've already selected this item!",
  ...rest
}: SelectProps & React.ComponentProps<typeof CommandPrimitive.Input>) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = React.useCallback((item: Item) => {
    setSelected((prev) => prev.filter((s) => s.value !== item.value))
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              return newSelected
            })
          }
        }

        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    []
  )

  const selectables = items.filter((item) => !selected.includes(item))

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((item) => {
            return (
              <Badge key={item.value} variant="secondary">
                {item.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}

          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? 'Select item'}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 placeholder:select-none"
            {...rest}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (inputValue !== '' || selectables.length > 0) && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((item) => {
                return (
                  <CommandItem
                    key={item.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue('')

                      if (selected.length >= limit) {
                        return toast.info(limitWaring)
                      }

                      if (!selected.find((s) => s.value === item.value)) {
                        return setSelected((prev) => [...prev, item])
                      }

                      toast.info(duplicateWarning)
                    }}
                    className={'cursor-pointer'}
                  >
                    {item.label}
                  </CommandItem>
                )
              })}
              {inputValue && creatable && (
                <CommandItem
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onSelect={() => {
                    setInputValue('')

                    if (selected.length >= limit) {
                      return toast.info("You've reached the limit!")
                    }

                    if (!selected.find((s) => s.value === inputValue)) {
                      return setSelected((prev) => [
                        ...prev,
                        { label: inputValue, value: inputValue },
                      ])
                    }

                    toast.info("You've already selected this item!")
                  }}
                  className={'cursor-pointer'}
                >
                  &apos;{inputValue}&apos; enter to create new!
                </CommandItem>
              )}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
