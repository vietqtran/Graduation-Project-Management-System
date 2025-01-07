import * as React from 'react'

import Image from 'next/image'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    const [isShowPassword, setIsShowPassword] = React.useState(false)

    return (
      <div className='relative'>
        <input
          type={isShowPassword ? 'text' : type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            type === 'password' && 'pr-8',
            className
          )}
          ref={ref}
          {...props}
          autoComplete='off'
          placeholder={isShowPassword ? 'P@ssword123' : props.placeholder}
        />
        {type === 'password' && (
          <button
            type='button'
            onClick={() => setIsShowPassword(!isShowPassword)}
            className='p-2 opacity-80 cursor-pointer absolute right-0 top-1/2 -translate-y-1/2'
          >
            {!isShowPassword ? (
              <Image
                className='size-4'
                src='/icons/hide-password.svg'
                width={16}
                height={16}
                alt='eye icon'
                loading='lazy'
              />
            ) : (
              <Image className='size-4' src='/icons/eyes.svg' width={16} height={16} alt='eye icon' loading='lazy' />
            )}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
