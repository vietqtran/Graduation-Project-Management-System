import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis
} from '@/components/ui/pagination'
import useManagement from '@/hooks/useManagement'
import { StudentsResponse } from '@/types/management.type'
import React, { useEffect, useMemo, useState } from 'react'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaFilterCircleXmark, FaAngleRight } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

const StudentsTable = () => {
  const [search, setSearch] = useState('')
  const { getStudents } = useManagement()
  const router = useRouter()
  const [studentsData, setStudentsData] = useState<StudentsResponse>({
    total: 0,
    list: []
  })

  // Pagination state
  const [page, setPage] = useState(1)
  const limit = 10
  const totalPages = Math.ceil(studentsData.total / limit) || 1

  // State for sorting: record of field keys and sort order (1 for asc, -1 for desc)
  const [sort, setSort] = useState<Record<string, 1 | -1>>({})

  // Modified fetchStudents to accept sort and page parameters.
  const fetchStudents = async (sortObj: Record<string, 1 | -1> = {}, pageParam: number) => {
    const response = await getStudents({
      page: pageParam,
      limit,
      sort: sortObj
    })
    setStudentsData(response)
  }

  // Fetch data on mount and whenever page or sort changes.
  useEffect(() => {
    fetchStudents(sort, page)
  }, [page, sort])

  // Filter students based on search query across multiple fields.
  const filteredStudents = useMemo(() => {
    if (!search) return studentsData.list
    const searchTerm = search.toLowerCase()
    return studentsData.list.filter((student) => {
      return (
        student.display_name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.campus.toLowerCase().includes(searchTerm) ||
        (student.code && student.code.toLowerCase().includes(searchTerm)) ||
        student.project.name.toLowerCase().includes(searchTerm)
      )
    })
  }, [search, studentsData])

  // Toggles sort order for the given field and resets to page 1.
  const toggleSort = (field: string) => {
    const current = sort[field]
    const newOrder = current === 1 ? -1 : 1
    const newSort: Record<string, 1 | -1> = { ...sort, [field]: newOrder }
    setSort(newSort)
    setPage(1) // Reset to page 1 when sorting changes
  }

  // Clears all sorting.
  const handleClearSorting = () => {
    setSort({})
    setPage(1)
  }

  // Placeholder functions for handling update and view actions.
  const handleUpdate = (student: (typeof studentsData.list)[number]) => {
    router.push(`/management/students/${student._id}/edit`)
  }

  const handleView = (student: (typeof studentsData.list)[number]) => {
    router.push(`/management/students/${student._id}/details`)
  }

  // Helper function to render a sortable table head cell.
  // When the field is currently sorted, the cell will have a grey background.
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

  // Helper function to render Pagination page links.
  const renderPageLinks = () => {
    const items = []

    // If total pages are less than or equal to 7, display all page numbers.
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
      // Always show first page.
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

      // Show ellipsis if current page is beyond page 4.
      if (page > 4) {
        items.push(
          <PaginationItem key='start-ellipsis'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Determine window for pages around current page.
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

      // Show ellipsis if current page is before totalPages - 3.
      if (page < totalPages - 3) {
        items.push(
          <PaginationItem key='end-ellipsis'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Always show last page.
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
    <div className='p-4'>
      {/* Search Bar and Clear Sorting Button */}
      <div className='flex items-center justify-between mb-4'>
        <Input
          type='text'
          placeholder='Search students...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full max-w-xs'
        />
        <Button onClick={handleClearSorting} disabled={Object.keys(sort).length === 0} size='sm'>
          <FaFilterCircleXmark className='mr-2' />
          Clear Sorting
        </Button>
      </div>

      {/* Data Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {renderSortableHead('Name', 'display_name')}
            {renderSortableHead('Email', 'email')}
            {renderSortableHead('Campus', 'campus')}
            {renderSortableHead('Code', 'code')}
            {renderSortableHead('Field', 'field')}
            {renderSortableHead('Major', 'major')}
            {renderSortableHead('Project', 'project')}
            {renderSortableHead('Leader', 'is_leader')}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.display_name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.campus}</TableCell>
              <TableCell>{student.code || '-'}</TableCell>
              <TableCell>{student.field.join(', ') || '-'}</TableCell>
              <TableCell>{student.major.join(', ') || '-'}</TableCell>
              <TableCell>{student.project.name}</TableCell>
              <TableCell>{student.is_leader ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className='flex space-x-2'>
                  <Button variant='outline' size='sm' onClick={() => handleUpdate(student)}>
                    Update
                  </Button>
                  <Button variant='outline' size='sm' onClick={() => handleView(student)}>
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls using Shadcn's Pagination component */}
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

export default StudentsTable
