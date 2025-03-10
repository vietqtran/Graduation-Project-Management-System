'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import instance from '@/utils/axios'
import React, { useState } from 'react'
import { toast } from 'sonner'
import RequestModal from './RequestModal'
import ConfirmModal from './ConfirmModal'

interface Request {
  _id: string
  remark: string
  to_user: string
  type: string
  from_user: string
  document: string
  due_date?: Date
  status: string
  created_at?: Date
  updated_at?: Date
  description?: string
  approve_user?: string
  documents?: string[]
}

interface RequestTableProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  requests: Request[]
}

const RequestTable: React.FC<RequestTableProps> = ({ requests, setRefresh }) => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [modalType, setModalType] = useState<'update' | 'detail' | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string | null }>({ id: null })

  const handleDelete = (id: string) => {
    setConfirmDelete({ id })
  }

  const confirmDeleteRequest = async () => {
    if (!confirmDelete.id) return

    try {
      await instance.delete(`/request/delete-request/${confirmDelete.id}`, { withCredentials: true })
      toast.success('Request deleted successfully!')
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error('Error deleting request:', error)
      toast.error('Failed to delete request.')
    } finally {
      setConfirmDelete({ id: null })
    }
  }

  const handleUpdate = (request: Request) => {
    setSelectedRequest(request)
    setModalType('update')
  }

  const handleDetail = (request: Request) => {
    setSelectedRequest(request)
    setModalType('detail')
  }

  const closeModal = () => {
    setSelectedRequest(null)
    setModalType(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
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
              <TableCell>{request.type || 'N/A'}</TableCell>
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
                      onClick={() => handleDetail(request)}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='w-full text-center justify-center bg-black text-white border border-blue-500 transition-all duration-200 hover:text-red-500 hover:-translate-y-1'
                      onClick={() => handleUpdate(request)}
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

      {modalType && selectedRequest && (
        <RequestModal
          request={{
            ...selectedRequest,
            due_date: selectedRequest.due_date ? new Date(selectedRequest.due_date).toISOString() : undefined
          }}
          type={modalType}
          onClose={closeModal}
          onSubmit={() => setRefresh((prev) => !prev)}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmDelete.id}
        onClose={() => setConfirmDelete({ id: null })}
        onConfirm={confirmDeleteRequest}
      />
    </>
  )
}

export default RequestTable
