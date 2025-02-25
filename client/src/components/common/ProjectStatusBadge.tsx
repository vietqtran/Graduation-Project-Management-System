import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

import { Badge } from '../ui/badge'
import { PROJECT_STATUS } from '@/constants/status'
import React from 'react'

type Props = {
  status: number
}

const ProjectStatusBadge = ({ status }: Props) => {
  const getProjectStatusBadgeStyle = () => {
    switch (status) {
      case PROJECT_STATUS.APPROVED:
        return 'bg-green-100 text-green-800'
      case PROJECT_STATUS.SUBMITTED:
        return 'bg-blue-100 text-blue-800'
      case PROJECT_STATUS.REJECTED:
        return 'bg-red-100 text-red-800'
      case PROJECT_STATUS.BLOCKED:
        return 'bg-yellow-100 text-yellow-800'
      case PROJECT_STATUS.PENDING:
        return 'bg-gray-100 text-gray-800'
      case PROJECT_STATUS.CANCELLED:
        return 'bg-orange-100 text-orange-800'
      case PROJECT_STATUS.UN_ACTIVE:
        return 'bg-netural-100 text-netural-800'
      default:
        return 'bg-white ring-1 text-gray-800'
    }
  }

  const getProjectStatusName = () => {
    switch (status) {
      case PROJECT_STATUS.APPROVED:
        return 'Approved'
      case PROJECT_STATUS.SUBMITTED:
        return 'Submitted'
      case PROJECT_STATUS.REJECTED:
        return 'Rejected'
      case PROJECT_STATUS.BLOCKED:
        return 'Blocked'
      case PROJECT_STATUS.PENDING:
        return 'Pending'
      case PROJECT_STATUS.CANCELLED:
        return 'Cancelled'
      case PROJECT_STATUS.UN_ACTIVE:
        return 'Un-Active'
      default:
        return 'Unknown'
    }
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={getProjectStatusBadgeStyle()} variant='outline'>
            {getProjectStatusName()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getProjectStatusName()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ProjectStatusBadge
