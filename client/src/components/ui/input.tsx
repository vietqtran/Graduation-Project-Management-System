import * as React from 'react'

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
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'>
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  d='M22 8s-4 6-10 6S2 8 2 8m13 5.5l1.5 2.5m3.5-5l2 2M2 13l2-2m5 2.5L7.5 16'
                  color='currentColor'
                />
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'>
                <g
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  color='currentColor'
                >
                  <path d='M21.544 11.045c.304.426.456.64.456.955c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045' />
                  <path d='M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0' />
                </g>
              </svg>
            )}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
