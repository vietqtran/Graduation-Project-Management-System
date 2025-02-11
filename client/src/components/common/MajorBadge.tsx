import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

import { Badge } from '../ui/badge'
import React from 'react'

type Props = {
  name: string
  description?: string
}

const MajorBadge = ({ name, description }: Props) => {
  const getMajorBadgeStyle = () => {
    switch (name) {
      case 'HE':
        return 'bg-green-100 text-green-800'
      case 'HS':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={getMajorBadgeStyle()} variant='outline'>
            {name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default MajorBadge
