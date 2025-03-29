import useStudentInquiry from '@/hooks/useStudentInquiry'
import { StudentInquiry } from '@/types/student-inquiry.type'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STUDENT_INQUIRY_STATUS } from '@/constants/status.enum'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { format, parseISO } from 'date-fns'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaAngleRight, FaFilterCircleXmark, FaPlus } from 'react-icons/fa6'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
const StudentInquiryList = () => {
  const router = useRouter()
  const { studentGetListInquiries } = useStudentInquiry()
  const [inquiries, setInquiries] = useState<StudentInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<
    STUDENT_INQUIRY_STATUS.PROCESSING | STUDENT_INQUIRY_STATUS.APPROVED | 'ALL'
  >('ALL')
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState<Record<string, 1 | -1>>({})

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await studentGetListInquiries({
        page,
        limit,
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        sort: sort
      })
      console.log(response.list)
      setInquiries(response.list)
      setTotal(response.total)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [page, selectedStatus, sort])

  const getStatusColor = (status: StudentInquiry['status']) => {
    switch (status) {
      case STUDENT_INQUIRY_STATUS.PROCESSING:
        return 'bg-yellow-500'
      case STUDENT_INQUIRY_STATUS.APPROVED:
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    const valueStatus =
      value === 'ALL' ? 'ALL' : (Number(value) as STUDENT_INQUIRY_STATUS.PROCESSING | STUDENT_INQUIRY_STATUS.APPROVED)
    setSelectedStatus(valueStatus)
    setPage(1)
  }

  const toggleSort = (field: string) => {
    const current = sort[field]
    const newOrder = current === 1 ? -1 : 1
    const newSort: Record<string, 1 | -1> = { ...sort, [field]: newOrder }
    setSort(newSort)
    setPage(1) // Reset to page 1 when sorting changes
  }

  const handleClearSorting = () => {
    setSort({})
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit) || 1

  // Helper function to render a sortable table head cell
  const renderSortableHead = (label: string, field: string) => (
    <TableHead className={sort[field] ? 'bg-gray-200' : ''}>
      <div className='flex items-center justify-between'>
        <span>{label}</span>
        <button onClick={() => toggleSort(field)} className='ml-2'>
          {sort[field] === 1 ? <FiArrowDown /> : sort[field] === -1 ? <FiArrowUp /> : <FaAngleRight />}
        </button>
      </div>
    </TableHead>
  )

  // Add TableSkeleton component
  const TableSkeleton = () => (
    <TableBody>
      {[...Array(limit)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className='h-4 w-[200px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[100px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[150px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[150px]' />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )

  // Helper function to render Pagination page links
  const renderPageLinks = () => {
    const items = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href='#'
              onClick={(e) => {
                e.preventDefault()
                setPage(i)
              }}
              className={page === i ? 'font-bold' : ''}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href='#'
            onClick={(e) => {
              e.preventDefault()
              setPage(1)
            }}
            className={page === 1 ? 'font-bold' : ''}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (page > 4) {
        items.push(
          <PaginationItem key='start-ellipsis'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href='#'
              onClick={(e) => {
                e.preventDefault()
                setPage(i)
              }}
              className={page === i ? 'font-bold' : ''}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (page < totalPages - 3) {
        items.push(
          <PaginationItem key='end-ellipsis'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href='#'
            onClick={(e) => {
              e.preventDefault()
              setPage(totalPages)
            }}
            className={page === totalPages ? 'font-bold' : ''}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <div className='space-y-4 p-4'>
      {/* Filters Section */}
      <Card className='p-6'>
        <div className='grid gap-6'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-medium'>Filters</h3>
            <div className='flex gap-2 items-center'>
              <Button
                onClick={handleClearSorting}
                variant='outline'
                size='sm'
                disabled={Object.keys(sort).length === 0}
              >
                <FaFilterCircleXmark className='mr-2' />
                Clear Sorting
              </Button>
              <Button onClick={() => router.push('/student-inquiry/add')} variant='outline' size='sm'>
                <FaPlus className='mr-2' />
                Add Inquiry
              </Button>
            </div>
          </div>

          {/* Search Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>Title</Label>
              <Input placeholder='Search by title...' value={searchTerm} onChange={handleSearch} />
            </div>

            <div className='space-y-2'>
              <Label>Status</Label>
              <Select value={String(selectedStatus)} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>All Status</SelectItem>
                  <SelectItem value={String(STUDENT_INQUIRY_STATUS.PROCESSING)}>Processing</SelectItem>
                  <SelectItem value={String(STUDENT_INQUIRY_STATUS.APPROVED)}>Answered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              {renderSortableHead('Created At', 'created_at')}
              {renderSortableHead('Answered At', 'answered_at')}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <TableSkeleton />
          ) : (
            <TableBody>
              {inquiries?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className='text-center h-24'>
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries
                  .filter((inquiry) => inquiry?.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((inquiry) => (
                    <TableRow key={inquiry._id}>
                      <TableCell className='font-medium'>{inquiry.title}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(inquiry.status)}>
                          {inquiry.status === STUDENT_INQUIRY_STATUS.PROCESSING ? 'Processing' : 'Answered'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(parseISO(inquiry?.created_at), 'MMM dd, yyyy HH:mm') || '-'}</TableCell>
                      <TableCell>
                        {inquiry?.answered_at ? format(parseISO(inquiry?.answered_at), 'MMM dd, yyyy HH:mm') : '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant='outline' size='sm'>
                          <Link href={`/student-inquiry/${inquiry._id}/details`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className='mt-4'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={(e) => {
                  e.preventDefault()
                  setPage((prev) => Math.max(prev - 1, 1))
                }}
              />
            </PaginationItem>
            {renderPageLinks()}
            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={(e) => {
                  e.preventDefault()
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default StudentInquiryList
