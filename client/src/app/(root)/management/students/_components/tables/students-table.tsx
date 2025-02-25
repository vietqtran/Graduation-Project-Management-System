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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import useMajor from '@/hooks/public/useMajor'
import useField from '@/hooks/public/useField'
import useCampus from '@/hooks/public/useCampus'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const StudentsTable = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { majors } = useMajor()
  const { fields } = useField()
  const { campuses } = useCampus()
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
    setIsLoading(true)
    try {
      const response = await getStudents({
        page: pageParam,
        limit,
        sort: sortObj
      })
      setStudentsData(response)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on mount and whenever page or sort changes.
  useEffect(() => {
    fetchStudents(sort, page)
  }, [page, sort])

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    code: '',
    project: '',
    campus: '',
    field: '',
    isLeader: ''
  })

  // Modified filter logic to handle 'all' value
  const filteredStudents = useMemo(() => {
    return studentsData.list.filter((student) => {
      const nameMatch = student.display_name.toLowerCase().includes(filters.name.toLowerCase())
      const emailMatch = student.email.toLowerCase().includes(filters.email.toLowerCase())
      const codeMatch = student.code?.toLowerCase().includes(filters.code.toLowerCase()) ?? true
      const projectMatch = student.project.name.toLowerCase().includes(filters.project.toLowerCase())
      const campusMatch = !filters.campus || filters.campus === 'all' || student.campus === filters.campus
      const fieldMatch = !filters.field || filters.field === 'all' || student.field.some((f) => f._id === filters.field)
      const leaderMatch =
        !filters.isLeader ||
        filters.isLeader === 'all' ||
        (filters.isLeader === 'true' ? student.is_leader : !student.is_leader)

      return nameMatch && emailMatch && codeMatch && projectMatch && campusMatch && fieldMatch && leaderMatch
    })
  }, [filters, studentsData])

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      name: '',
      email: '',
      code: '',
      project: '',
      campus: '',
      field: '',
      isLeader: ''
    })
  }

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
  const handleUpdate = (id: string) => {
    router.push(`/management/students/${id}/edit`)
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

  // Add TableSkeleton component
  const TableSkeleton = () => (
    <TableBody>
      {[...Array(limit)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className='h-4 w-[120px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[180px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[80px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[80px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[100px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[100px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[150px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-[40px]' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-8 w-8 rounded-full' />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )

  return (
    <div className='space-y-4 p-4'>
      {/* Filters Section */}
      <Card className='p-6'>
        <div className='grid gap-6'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-medium'>Filters</h3>
            <div className='space-x-2 flex align-center'>
              <Button onClick={handleResetFilters} variant='outline' size='sm'>
                Reset Filters
              </Button>
              <Button
                onClick={handleClearSorting}
                variant='outline'
                size='sm'
                disabled={Object.keys(sort).length === 0}
              >
                <FaFilterCircleXmark className='mr-2' />
                Clear Sorting
              </Button>
            </div>
          </div>

          {/* Search Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='space-y-2'>
              <Label>Name</Label>
              <Input
                placeholder='Search by name...'
                value={filters.name}
                onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className='space-y-2'>
              <Label>Email</Label>
              <Input
                placeholder='Search by email...'
                value={filters.email}
                onChange={(e) => setFilters((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className='space-y-2'>
              <Label>Student Code</Label>
              <Input
                placeholder='Search by code...'
                value={filters.code}
                onChange={(e) => setFilters((prev) => ({ ...prev, code: e.target.value }))}
              />
            </div>

            <div className='space-y-2'>
              <Label>Project</Label>
              <Input
                placeholder='Search by project...'
                value={filters.project}
                onChange={(e) => setFilters((prev) => ({ ...prev, project: e.target.value }))}
              />
            </div>
          </div>

          {/* Selectors */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label>Campus</Label>
              <Select
                value={filters.campus || 'all'}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, campus: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Campuses' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Campuses</SelectItem>
                  {campuses?.map((campus) => (
                    <SelectItem key={campus._id} value={campus._id}>
                      {campus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Field</Label>
              <Select
                value={filters.field || 'all'}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, field: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Fields' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Fields</SelectItem>
                  {fields?.map((field) => (
                    <SelectItem key={field._id} value={field._id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Leader Status</Label>
              <Select
                value={filters.isLeader || 'all'}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, isLeader: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='true'>Leader</SelectItem>
                  <SelectItem value='false'>Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table Section */}
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
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.display_name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.campus}</TableCell>
                <TableCell>{student.code || '-'}</TableCell>
                <TableCell>{student.field.map((f) => f.name).join(', ') || '-'}</TableCell>
                <TableCell>{student.major.map((m) => m.name).join(', ') || '-'}</TableCell>
                <TableCell>{student.project.name}</TableCell>
                <TableCell>{student.is_leader ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleUpdate(student._id)}>Update</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleView(student)}>View</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
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
