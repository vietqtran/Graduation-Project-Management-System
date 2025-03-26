import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned':
        return {
          label: 'Assigned',
          variant: 'default' as const,
          className: 'bg-blue-500'
        }
      case 'approved':
        return {
          label: 'Approved',
          variant: 'default' as const,
          className: 'bg-green-500'
        }
      case 'rejected':
        return {
          label: 'Rejected',
          variant: 'destructive' as const
        }
      case 'submitted':
        return {
          label: 'Submitted',
          variant: 'default' as const,
          className: 'bg-yellow-500'
        }
      default:
        return {
          label: status,
          variant: 'secondary' as const
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}
