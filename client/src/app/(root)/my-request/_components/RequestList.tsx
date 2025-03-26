import { Request } from '@/types/request.type'
import { RequestItem } from './RequestItem'

interface RequestListProps {
  requests: Request[]
  onClickOpenUploadModal: (id: string) => void
}

export function RequestList({ requests, onClickOpenUploadModal }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className='text-center py-10 border rounded-lg bg-muted/50'>
        <p className='text-muted-foreground'>Không có yêu cầu nào</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      {requests.map((request) => (
        <RequestItem
          isSumitted={request.status === 'submitted'}
          id={request._id}
          onClickOpenUploadModal={onClickOpenUploadModal}
          key={request._id}
          request={request}
        />
      ))}
    </div>
  )
}
