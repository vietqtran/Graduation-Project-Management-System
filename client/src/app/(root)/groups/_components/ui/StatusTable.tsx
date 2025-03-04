import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { FaComment } from 'react-icons/fa'

interface Task {
  remark: string
  created_at: Date
  status: string
  description: string
  commentCount: number
}

interface StatusTableProps {
  tasks: Task[]
  filteredStatuses: string[] // Status filters passed from parent
}

const getStatusLabelClass = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-200 text-green-900'
    case 'In Progress':
      return 'bg-yellow-200 text-yellow-900'
    case 'Overdue':
      return 'bg-red-200 text-red-900'
    case 'Submitted':
      return 'bg-blue-200 text-blue-900'
    case 'Following':
      return 'bg-purple-200 text-purple-900'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

const StatusTable: React.FC<StatusTableProps> = ({ tasks, filteredStatuses }) => {
  // Filter tasks based on selected status filters
  const filteredTasks = tasks.filter((task) => {
    // If 'All' is selected or no filters are selected, show everything
    if (filteredStatuses.includes('All') || filteredStatuses.length === 0) {
      return true
    }
    // Otherwise, only show tasks that match the selected statuses
    return filteredStatuses.includes(task.status)
  })

  return (
    <div className='overflow-x-auto shadow-md sm:rounded-lg'>
      <Table className='min-w-full text-sm text-left text-gray-500'>
        <TableHeader>
          <TableRow>
            <TableHead className='px-6 py-3'>Title</TableHead>
            <TableHead className='px-6 py-3'>Create at</TableHead>
            <TableHead className='px-6 py-3'>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TableRow key={index} className='bg-white border-b hover:bg-gray-50'>
                <TableCell className='px-6 py-4'>
                  <div className='flex items-center space-x-2'>
                    <span className='font-medium'>{task.remark}</span>
                    <div className='flex items-center space-x-1'>
                      <FaComment className='text-gray-500 text-sm' />
                      <span className='text-xs text-gray-500'>{task.commentCount}</span>
                    </div>
                  </div>
                  <p className='text-xs text-gray-400'>{task.description}</p>
                </TableCell>
                <TableCell className='px-6 py-4'>{new Date(task.created_at).toLocaleString()}</TableCell>
                <TableCell className='px-6 py-4'>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusLabelClass(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className='text-center py-4'>
                No tasks matching the selected filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default StatusTable
