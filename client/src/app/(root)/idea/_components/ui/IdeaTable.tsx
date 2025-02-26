'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProjectIdea } from './ReviewIdeas'

interface IdeaTableProps {
  ideas: ProjectIdea[]
  startIndex: number
}

const IdeaTable: React.FC<IdeaTableProps> = ({ ideas, startIndex }) => {
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
              <TableCell>{idea.remark}</TableCell>
              <TableCell>{idea.type}</TableCell>
              <TableCell className='flex justify-center gap-2 py-2'>
                <Button variant='default'>Accept</Button>
                <Button variant='destructive'>Reject</Button>
                <Button variant='outline' onClick={() => (window.location.href = '/idea/idea-detail')}>
                  Detail
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
