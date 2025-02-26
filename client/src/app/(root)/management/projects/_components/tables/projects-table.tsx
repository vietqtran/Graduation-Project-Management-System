import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink
} from '@/components/ui/pagination'
import useManagement from '@/hooks/useManagement'
import { ProjectsResponse } from '@/types/management.type'
import React, { useEffect, useState } from 'react'
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
import { Badge } from '@/components/ui/badge'

const ProjectsTable = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { majors } = useMajor()
  const { fields } = useField()
  const { campuses } = useCampus()
  const { getListProjects } = useManagement()
  const router = useRouter()
  const [projectsData, setProjectsData] = useState<ProjectsResponse>({
    total: 0,
    list: []
  })

  // Pagination state
  const [page, setPage] = useState(1)
  const limit = 10
  const totalPages = Math.ceil(projectsData.total / limit) || 1

  // State for sorting
  const [sort, setSort] = useState<Record<string, 1 | -1>>({})

  // Filters state for projects
  const [filters, setFilters] = useState({
    name: '',
    major: '',
    field: '',
    campus: '',
    category: '',
    status: '',
    stage: '',
    supervisorName: ''
  })

  const fetchProjects = async (sortObj: Record<string, 1 | -1> = {}, pageParam: number) => {
    setIsLoading(true)
    try {
      // Create a base params object
      const requestParams: Record<string, unknown> = {
        page: pageParam,
        limit,
        sort: sortObj
      }

      // Only add filters if they exist and aren't 'all'
      if (filters.name) requestParams.name = filters.name
      if (filters.major && filters.major !== 'all') requestParams.major = filters.major
      if (filters.field && filters.field !== 'all') requestParams.field = filters.field
      if (filters.campus && filters.campus !== 'all') requestParams.campus = filters.campus
      if (filters.category && filters.category !== 'all') requestParams.category = parseInt(filters.category) as 1 | 2
      if (filters.status) requestParams.status = parseInt(filters.status)
      if (filters.stage && filters.stage !== 'all') requestParams.stage = parseInt(filters.stage)
      if (filters.supervisorName) requestParams.supervisorName = filters.supervisorName

      const response = await getListProjects(requestParams)
      if (response) {
        setProjectsData(response)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects(sort, page)
  }, [page, sort, filters])

  const handleResetFilters = () => {
    setFilters({
      name: '',
      major: '',
      field: '',
      campus: '',
      category: '',
      status: '',
      stage: '',
      supervisorName: ''
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
    router.push(`/management/projects/${id}/edit`)
  }

  const handleView = (project: (typeof projectsData.list)[number]) => {
    router.push(`/management/projects/${project._id}/details`)
  }

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

  const getStatusBadge = (status: number | null | undefined) => {
    if (status === null || status === undefined) return <Badge variant='outline'>Not Set</Badge>
    switch (status) {
      case 1:
        return <Badge variant='default'>Active</Badge>
      case 0:
        return <Badge variant='secondary'>Inactive</Badge>
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  const getStageBadge = (stage: number) => {
    switch (stage) {
      case 1:
        return <Badge className='bg-blue-500'>Planning</Badge>
      case 2:
        return <Badge className='bg-yellow-500'>In Progress</Badge>
      case 3:
        return <Badge className='bg-green-500'>Completed</Badge>
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  const getCategoryBadge = (category: 1 | 2) => {
    return (
      <Badge variant={category === 1 ? 'default' : 'secondary'}>{category === 1 ? 'Category 1' : 'Category 2'}</Badge>
    )
  }

  const TableSkeleton = () => (
    <TableBody>
      {[...Array(limit)].map((_, index) => (
        <TableRow key={index}>
          {[...Array(8)].map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className='h-4 w-[100px]' />
            </TableCell>
          ))}
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label>Project Name</Label>
              <Input
                placeholder='Search by name...'
                value={filters.name}
                onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className='space-y-2'>
              <Label>Supervisor Name</Label>
              <Input
                placeholder='Search by supervisor...'
                value={filters.supervisorName}
                onChange={(e) => setFilters((prev) => ({ ...prev, supervisorName: e.target.value }))}
              />
            </div>

            <div className='space-y-2'>
              <Label>Stage</Label>
              <Select
                value={filters.stage}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Stages' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Stages</SelectItem>
                  <SelectItem value='1'>Planning</SelectItem>
                  <SelectItem value='2'>In Progress</SelectItem>
                  <SelectItem value='3'>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selectors */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='space-y-2'>
              <Label>Campus</Label>
              <Select
                value={filters.campus}
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
                value={filters.major}
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
              <Label>Field</Label>
              <Select
                value={filters.field}
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
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  <SelectItem value='1'>Category 1</SelectItem>
                  <SelectItem value='2'>Category 2</SelectItem>
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
            {renderSortableHead('Name', 'name')}
            {renderSortableHead('Category', 'category')}
            {renderSortableHead('Stage', 'stage')}
            {renderSortableHead('Status', 'status')}
            {renderSortableHead('Members', 'noMembers')}
            {renderSortableHead('Mark', 'mark')}
            <TableHead>Supervisor</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <TableBody>
            {projectsData.list.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{getCategoryBadge(project.category)}</TableCell>
                <TableCell>{getStageBadge(project.stage)}</TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell>{project.noMembers}</TableCell>
                <TableCell>{project.mark ?? '-'}</TableCell>
                <TableCell>
                  {project.supervisor ? project.supervisor.map((s) => s.display_name).join(', ') : '-'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleUpdate(project._id)}>Update</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleView(project)}>View</DropdownMenuItem>
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
            {/* Render page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(pageNum)
                  }}
                  className={page === pageNum ? 'font-bold' : ''}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
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

export default ProjectsTable
