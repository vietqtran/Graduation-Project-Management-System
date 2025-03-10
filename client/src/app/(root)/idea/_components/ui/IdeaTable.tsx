'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import instance from '@/utils/axios'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface ProjectIdea {
  _id: string
  name: string
  field: string
  description: string // Add this line
  status: string
  created_at: string
  updated_at: string
  campus: string
}

interface IdeaTableProps {
  ideas: ProjectIdea[]
  startIndex: number
}

const IdeaTable: React.FC<IdeaTableProps> = ({ ideas, startIndex }) => {
const [loadingId, setLoadingId] = useState<string | null>(null) // ID của project đang xử lý

  const handleAccept = useCallback(async (id: string) => {
    if (!id || loadingId) return // Ngăn gọi API nếu không có ID hoặc đang xử lý

    setLoadingId(id) // Đánh dấu project đang xử lý
    try {
      const response = await instance.patch('/project/approve-idea', { id, status: "APPROVED" }, { withCredentials: true })
      if (response.status === 200) {
        toast.success('Idea accepted successfully')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to accept idea')
    } finally {
      setLoadingId(null) // Reset trạng thái sau khi API hoàn thành
    }
  }, [loadingId])
  return (
    <div className='w-full overflow-auto rounded-md border shadow-md'>
      <Table className='min-w-full bg-white'>
        <TableHeader>
          <TableRow className='bg-gray-100'>
            <TableHead className='w-12 text-center'>#</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Team Name</TableHead>
            <TableHead className='text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea, index) => (
            <TableRow key={idea._id} className='hover:bg-gray-50'>
              <TableCell className='text-center'>{startIndex + index + 1}</TableCell>
              <TableCell>{idea.name}</TableCell>
              <TableCell>{idea._id}</TableCell>
              <TableCell className='flex justify-center gap-2 py-2'>
                <Button variant='default' onClick={() => handleAccept(idea._id)}>
                  Accept
                </Button>
                <Button variant='destructive' onClick={() => toast.success('Idea reject successfully')}>
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default IdeaTable
