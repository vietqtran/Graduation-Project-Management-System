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
import { TeachersResponse } from '@/types/management.type'
import React, { useEffect, useMemo, useState } from 'react'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaFilterCircleXmark, FaAngleRight } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import useMajor from '@/hooks/public/useMajor'
import useCampus from '@/hooks/public/useCampus'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const TeachersTable = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { majors } = useMajor()
  const { campuses } = useCampus()
  const { getTeachers } = useManagement()
  const router = useRouter()
  const [teachersData, setTeachersData] = useState<TeachersResponse>({
    total: 0,
    list: []
  })

  // Pagination state
  const [page, setPage] = useState(1)
  const limit = 10
  const totalPages = Math.ceil(teachersData.total / limit) || 1

  // State for sorting
  const [sort, setSort] = useState<Record<string, 1 | -1>>({})

  // Filters state - adjusted for teacher specific fields
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    code: '',
    campus: '',
    major: '',
    role: '',
    noProjects: ''
  })

  const fetchTeachers = async (sortObj: Record<string, 1 | -1> = {}, pageParam: number) => {
    setIsLoading(true)
    try {
      const response = await getTeachers({
        page: pageParam,
        limit,
        sort: sortObj
      })
      setTeachersData(response)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers(sort, page)
  }, [page, sort])

  // Modified filter logic for teachers
  const filteredTeachers = useMemo(() => {
    return teachersData.list.filter((teacher) => {
      const nameMatch = teacher.display_name.toLowerCase().includes(filters.name.toLowerCase())
      const emailMatch = teacher.email.toLowerCase().includes(filters.email.toLowerCase())
      const codeMatch = teacher.code?.toLowerCase().includes(filters.code.toLowerCase()) ?? true
      const campusMatch = !filters.campus || filters.campus === 'all' || teacher.campus === filters.campus
      const majorMatch = !filters.major || filters.major === 'all' || teacher.major.includes(filters.major)
      const roleMatch =
        !filters.role || filters.role === 'all' || teacher.roles.includes(filters.role as 'lecturer' | 'supervisor')
      const projectsMatch = !filters.noProjects || teacher.noProjects.toString().includes(filters.noProjects)

      return nameMatch && emailMatch && codeMatch && campusMatch && majorMatch && roleMatch && projectsMatch
    })
  }, [filters, teachersData])

  const handleResetFilters = () => {
    setFilters({
      name: '',
      email: '',
      code: '',
      campus: '',
      major: '',
      role: '',
      noProjects: ''
    })
  }

  // Sort handlers
  const toggleSort = (field: string) => {
    const current = sort[field]
    const newOrder = current === 1 ? -1 : 1
    const newSort: Record<string, 1 | -1> = { ...sort, [field]: newOrder }
    setSort(newSort)
    setPage(1)
  }

  const handleClearSorting = () => {
    setSort({})
    setPage(1)
  }

  const handleUpdate = (id: string) => {
    router.push(`/management/teachers/${id}/edit`)
  }

  const handleView = (teacher: (typeof teachersData.list)[number]) => {
    router.push(`/management/teachers/${teacher._id}/details`)
  }

  // Add renderSortableHead function
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
              <Label>Teacher Code</Label>
              <Input
                placeholder='Search by code...'
                value={filters.code}
                onChange={(e) => setFilters((prev) => ({ ...prev, code: e.target.value }))}
              />
            </div>

            <div className='space-y-2'>
              <Label>Number of Projects</Label>
              <Input
                placeholder='Search by projects count...'
                value={filters.noProjects}
                onChange={(e) => setFilters((prev) => ({ ...prev, noProjects: e.target.value }))}
                type='number'
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
                    <SelectItem key={campus._id} value={campus.name}>
                      {campus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Major</Label>
              <Select
                value={filters.major || 'all'}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, major: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Majors' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Majors</SelectItem>
                  {majors?.map((major) => (
                    <SelectItem key={major._id} value={major._id}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Role</Label>
              <Select
                value={filters.role || 'all'}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Roles' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Roles</SelectItem>
                  <SelectItem value='lecturer'>Lecturer</SelectItem>
                  <SelectItem value='supervisor'>Supervisor</SelectItem>
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
            {renderSortableHead('Major', 'major')}
            {renderSortableHead('Roles', 'roles')}
            {renderSortableHead('Projects', 'noProjects')}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell>{teacher.display_name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.campus}</TableCell>
                <TableCell>{teacher.code || '-'}</TableCell>
                <TableCell>{teacher.major.join(', ') || '-'}</TableCell>
                <TableCell>
                  <div className='flex gap-1'>
                    {teacher.roles.map((role) => (
                      <Badge key={role} variant={role === 'lecturer' ? 'outline' : 'default'}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{teacher.noProjects}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleUpdate(teacher._id)}>Update</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleView(teacher)}>View</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

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

export default TeachersTable
