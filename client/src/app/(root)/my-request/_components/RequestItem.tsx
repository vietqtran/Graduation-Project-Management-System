import { Calendar, FileIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Request } from '@/types/request.type'
import { StatusBadge } from './StatusBadge'
import { enUS } from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns'
import instance from '@/utils/axios'
import { toast } from 'sonner'

interface RequestItemProps {
  request: Request
  onClickOpenUploadModal: (id: string) => void
  id: string
  isSumitted: boolean
}

export function RequestItem({ request, onClickOpenUploadModal, id, isSumitted }: RequestItemProps) {
  const dueDate = new Date(request.due_date)
  const formattedDueDate = formatDistanceToNow(dueDate, {
    addSuffix: true,
    locale: enUS
  })

  const handleSubmit = async () => {
    try {
      const { data } = await instance.post(`/request/student/submit`, { id }, { withCredentials: true })
      if (data.success) {
        toast.success('Request submitted successfully')
      } else {
        toast.error('Request submission failed')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
        <div>
          <CardTitle className='text-lg'>{request.type}</CardTitle>
          <p className='text-sm text-muted-foreground'>ID: {request._id}</p>
        </div>
        <StatusBadge status={request.status} />
      </CardHeader>
      <CardContent>
        <p className='mb-4'>{request.description}</p>

        <div className='flex items-center text-sm text-muted-foreground mb-2'>
          <Calendar className='mr-2 h-4 w-4' />
          <span>Due date: {formattedDueDate}</span>
        </div>

        <div className='mt-4'>
          <p className='text-sm font-medium mb-2'>Documents ({request.documents.length}):</p>
          {request?.documents?.length > 0 ? (
            <div className='space-y-2'>
              {request.documents.map((doc, index) => (
                <div key={index} className='flex items-center justify-between p-2 bg-muted rounded-md'>
                  <div className='flex items-center gap-2'>
                    <FileIcon className='h-4 w-4 mr-2' />
                    <span className='text-sm truncate'>{doc.title}</span>
                  </div>
                  <Link
                    target='_blank'
                    className='underline text-blue-500'
                    href={`${process.env.NEXT_PUBLIC_S3_BUCKET_PREFIX}${doc.file_url}`}
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No documents</p>
          )}
        </div>
      </CardContent>
      {!isSumitted && (
        <CardFooter className='flex flex-col items-start'>
          <div className='text-sm text-muted-foreground'>Từ: {request.from_user.display_name}</div>
          <div className='text-sm text-muted-foreground'>Đến: {request.to_user.display_name}</div>
          <div className='flex items-center gap-2'>
            <Button onClick={() => onClickOpenUploadModal(request._id)} className='mt-3'>
              Upload documents
            </Button>
            <Button onClick={handleSubmit} className='mt-3' variant={'outline'}>
              Submit
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
