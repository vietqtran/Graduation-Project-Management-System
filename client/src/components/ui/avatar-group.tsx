import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

import React from 'react'
import { twMerge } from 'tailwind-merge'

const AvatarGroup = ({ avatars, className = '' }: { avatars: { src: string; alt: string }[]; className?: string }) => {
  const maxVisible = 4
  const visibleAvatars = avatars.slice(0, maxVisible)
  const remainingCount = avatars.length - maxVisible

  return (
    <div tabIndex={0} className='flex items-center flex-row-reverse'>
      {remainingCount > 0 && (
        <div
          className={twMerge(
            `size-8 border rounded-full text-sm grid -mr-1 place-items-center cursor-default`,
            className
          )}
        >
          +{remainingCount}
        </div>
      )}
      {visibleAvatars.map((avatar, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className={twMerge(`size-8 -mr-1 border`, className)}>
                <AvatarImage src={avatar.src} alt={avatar.alt} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{avatar.alt}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

export default AvatarGroup
