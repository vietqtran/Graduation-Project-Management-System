'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import instance from '@/utils/axios'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
import React from 'react'
import { toast } from 'sonner'

interface Request {
  _id: number
  remark: string
  to_user: string
  type: string
  from_user: string
  document: string
  due_date?: Date  
  status: string
  created_at?: Date  
  updated_at?: Date  
}

interface RequestTableProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  requests: Request[]
}

const RequestTable: React.FC<RequestTableProps> = ({ requests, setRefresh }) => {
  // Hàm xử lý cho nút Delete
  const handleDelete = (id: number) => {
    console.log(id)
    try {
      const response = instance.delete(`/request/delete-request/${id}`, {
        withCredentials: true
      })
      response.then((res) => {
        console.log(res)
      })
      toast.success('Request deleted successfully')
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error('Error deleting request:', error)
      toast.error('Error deleting request')
    }
  }

  // Hàm xử lý cho nút Update
  const handleUpdate = (id: number) => {
    console.log('Update request with id:', id)
    // Thực hiện logic cập nhật ở đây
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Remark</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>To User</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request._id}>
            <TableCell>{request.status || 'N/A'}</TableCell>
            <TableCell>{request.remark || 'N/A'}</TableCell>
            <TableCell>{request.updated_at ? new Date(request.updated_at).toLocaleString() : 'N/A'}</TableCell>
            <TableCell>{request.created_at ? new Date(request.created_at).toLocaleString() : 'N/A'}</TableCell>
            <TableCell>{request.due_date ? new Date(request.due_date).toLocaleString() : 'N/A'}</TableCell>
            <TableCell>{request.to_user || 'N/A'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='default'>Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='center'
                  className='w-40 bg-black border text-red-500 border-blue-500 divide-y flex flex-col items-center rounded-lg'
                >
                  <DropdownMenuItem
                    className='w-full text-center justify-center bg-black text-white border border-blue-500 transition-all duration-200 hover:text-red-500 hover:-translate-y-1'
                    onClick={() => handleUpdate(request._id)}
                  >
                    Edit request
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='w-full text-center justify-center bg-black text-white border border-blue-500 transition-all duration-200 hover:text-red-500 hover:-translate-y-1'
                    onClick={() => handleDelete(request._id)}
                  >
                    Delete request
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RequestTable
