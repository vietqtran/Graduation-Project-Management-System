import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

import { Badge } from '../ui/badge'
import React from 'react'

type Props = {
  name: string
  description?: string
}

const FieldBadge = ({ name, description }: Props) => {
  const getFieldBadgeStyle = () => {
    switch (name) {
      case 'AI':
        return 'bg-blue-100 text-blue-800'
      case 'SE':
        return 'bg-purple-100 text-purple-800'
      case 'Cs':
        return 'bg-pink-100 text-pink-800'
      case 'DM':
        return 'bg-orange-100 text-orange-800'
      case 'IB':
        return 'bg-yellow-100 text-yellow-800'
      case 'ELing':
        return 'bg-green-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={getFieldBadgeStyle()} variant='outline'>
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

export default FieldBadge
