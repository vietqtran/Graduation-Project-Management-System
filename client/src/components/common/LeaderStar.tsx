import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

import React from 'react'
import StarYellowIcon from '../icons/StarYellow'

const LeaderStar = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <StarYellowIcon />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Leader</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LeaderStar
