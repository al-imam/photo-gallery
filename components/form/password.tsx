import { EyeIcon, EyeOffIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from 'shadcn/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Password = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onBlur, onFocus, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

    return (
      <div
        className={cn(
          'flex h-10 gap-2 w-full rounded-md border border-input bg-background px-3  text-sm ring-offset-background',
          { 'outline-none ring-2 ring-ring ring-offset-2': isFocused },
          className
        )}
      >
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          onBlur={(evt) => {
            if (typeof onBlur === 'function') onBlur(evt)
            setIsFocused(false)
          }}
          onFocus={(evt) => {
            if (typeof onFocus === 'function') onFocus(evt)
            setIsFocused(true)
          }}
          className={cn(
            'w-full border-none py-2 outline-none bg-transparent placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
          )}
          ref={ref}
          {...props}
        />

        <button
          type="button"
          onClick={() => setIsPasswordVisible((previous) => !previous)}
          className="border-none outline-none text-muted-foreground my-1.5 opacity-20 rounded-full bg-opacity-20 transition-all bg-transparent p-1 aspect-square -mr-[2px] flex justify-center items-center focus-visible:bg-muted hover:bg-muted hover:opacity-50"
        >
          {isPasswordVisible ? (
            <EyeOffIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    )
  }
)

Password.displayName = 'Password'
