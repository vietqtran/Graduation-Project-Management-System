'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import ConfirmModal from './ConfirmModal'
import RequestModal from './RequestModal'
import instance from '@/utils/axios'
import { toast } from 'sonner'

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
  selectedProjectId?: string
}

interface RequestTableProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  requests: Request[]
}

const RequestTable: React.FC<RequestTableProps> = ({ requests, setRefresh }) => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [modalType, setModalType] = useState<'update' | 'detail' | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string | null }>({ id: null })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const totalItems = requests.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Calculate the requests for the current page
  const currentRequests = useMemo(() => {
    const indexOfLastRequest = currentPage * itemsPerPage
    const indexOfFirstRequest = indexOfLastRequest - itemsPerPage
    return requests.slice(indexOfFirstRequest, indexOfLastRequest)
  }, [currentPage, itemsPerPage, requests])

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

  // Change the current page
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const statusColorMap: Record<string, string> = {
    assigned: 'text-blue-500',
    submitted: 'text-green-500',
    completed: 'text-purple-700',
    'in-progress': 'text-orange-500',
    overdue: 'text-red-500',
    'n/a': 'text-gray-500'
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>To User</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRequests?.map((request) => (
            <TableRow key={request._id}>
              <TableCell className={statusColorMap[request?.status.toLowerCase()] || 'text-gray-500'}>
                {request?.status || 'N/A'}
              </TableCell>
              <TableCell>{request?.remark || 'N/A'}</TableCell>
              <TableCell>
                <span>
                  {request?.description}
                </span>
              </TableCell>
              <TableCell>{request?.updated_at ? new Date(request.updated_at).toLocaleString() : 'N/A'}</TableCell>
              <TableCell>{request?.created_at ? new Date(request.created_at).toLocaleString() : 'N/A'}</TableCell>
              <TableCell>{request?.due_date ? new Date(request.due_date).toLocaleString() : 'N/A'}</TableCell>
              <TableCell>{request?.to_user || 'N/A'}</TableCell>
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

      <div className='flex justify-center mt-4 space-x-4'>
        <Button variant='secondary' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </Button>
        <span className='flex items-center justify-center text-sm text-gray-600'>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant='secondary'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default RequestTable
